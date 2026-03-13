import { chromium } from 'playwright';

const BASE_ORIGIN = process.env.UI_ORIGIN || 'http://localhost:5173';
const OUT_DIR = process.env.UI_OUT_DIR || 'artifacts/route-form-audit';

const ROUTES = [
  '/#/network/wireless-mode',
  '/#/network/star-flash-host',
  '/#/network/wifi-host',
  '/#/network/lan-basic',
  '/#/network/wireless-survey',
  '/#/interface/ethernet-switch',
  '/#/system/time-zone'
];

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function routeToFileStem(route) {
  return route
    .replace(/^\/#\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

async function mkdirp(path) {
  const { mkdir } = await import('node:fs/promises');
  await mkdir(path, { recursive: true });
}

async function writeJson(path, obj) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(path, JSON.stringify(obj, null, 2), 'utf8');
}

async function run() {
  const stamp = nowStamp();
  const outDir = `${OUT_DIR}/${stamp}`;
  const screensDir = `${outDir}/screens`;
  await mkdirp(screensDir);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1365, height: 768 } });
  const page = await context.newPage();

  const consoleEvents = [];
  const pageErrors = [];
  const requestFailures = [];

  page.on('console', (msg) => {
    consoleEvents.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  page.on('pageerror', (err) => {
    pageErrors.push(String(err?.stack || err));
  });
  page.on('requestfailed', (req) => {
    requestFailures.push({
      url: req.url(),
      method: req.method(),
      failure: req.failure()?.errorText || 'unknown'
    });
  });

  // Ensure app boots at least once.
  await page.goto(`${BASE_ORIGIN}/#/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('#app').waitFor({ timeout: 15000 });

  const results = [];

  for (const route of ROUTES) {
    const url = `${BASE_ORIGIN}${route}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('#app').waitFor({ timeout: 15000 });

    // Let Element Plus / Vue settle.
    await page.waitForTimeout(350);

    const pageInfo = await page.evaluate(() => {
      const isVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        const r = el.getBoundingClientRect();
        if (!r || r.width < 1 || r.height < 1) return false;
        return true;
      };

      const textOf = (el) => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();

      const dedupe = (arr) => {
        const out = [];
        const seen = new Set();
        for (const s of arr) {
          const v = String(s || '').trim();
          if (!v) continue;
          if (seen.has(v)) continue;
          seen.add(v);
          out.push(v);
        }
        return out;
      };

      const titleCandidates = [
        ...document.querySelectorAll('.page-title'),
        ...document.querySelectorAll('h1, h2, h3')
      ].filter(isVisible);
      const title = textOf(titleCandidates[0]) || '';

      const labelEls = [
        ...document.querySelectorAll('.el-form-item__label'),
        ...document.querySelectorAll('label')
      ].filter(isVisible);
      const labels = dedupe(labelEls.map(textOf)).filter((t) => t && t !== ':');

      const alertEls = [...document.querySelectorAll('.el-alert, [role=\"alert\"]')].filter(isVisible);
      const alerts = dedupe(alertEls.map(textOf));

      const bodyText = textOf(document.body);
      const placeholderKeywords = ['TODO', 'Coming soon', '暂未', '暂无', '未实现', '敬请期待', '开发中'];
      const placeholderHits = placeholderKeywords.filter((k) => bodyText.includes(k));

      const elSelectCount = document.querySelectorAll('.el-select').length;
      const nativeSelectCount = document.querySelectorAll('select').length;

      return {
        title,
        labels,
        alerts,
        placeholderHits,
        selectCounts: { elSelectCount, nativeSelectCount }
      };
    });

    // Collect Element Plus select options by opening each select one by one.
    const selects = [];
    const elSelects = page.locator('.el-select');
    const elSelectCount = await elSelects.count();
    for (let i = 0; i < elSelectCount; i++) {
      const root = elSelects.nth(i);
      if (!(await root.isVisible())) continue;

      // Try to find a nearby form item label for context.
      let label = '';
      try {
        const formItem = root.locator('xpath=ancestor::*[contains(concat(\" \", normalize-space(@class), \" \"), \" el-form-item \")][1]');
        const formLabel = formItem.locator('.el-form-item__label').first();
        if (await formLabel.count()) {
          label = (await formLabel.innerText()).replace(/\s+/g, ' ').trim();
        }
      } catch {
        // ignore
      }

      // Open dropdown.
      try {
        await root.click({ timeout: 5000 });
      } catch {
        // Fallback: click the input inside.
        const input = root.locator('input').first();
        if (await input.count()) await input.click({ timeout: 5000 });
      }

      const dropdown = page.locator('body .el-select-dropdown:visible').last();
      await dropdown.waitFor({ timeout: 7000 });
      const items = dropdown.locator('.el-select-dropdown__item');
      const itemCount = await items.count();
      const optionTexts = [];
      for (let j = 0; j < itemCount; j++) {
        const it = items.nth(j);
        if (!(await it.isVisible())) continue;
        const t = (await it.innerText()).replace(/\s+/g, ' ').trim();
        if (t) optionTexts.push(t);
      }

      // Close dropdown.
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(120);

      // Dedupe while preserving order.
      const seen = new Set();
      const options = optionTexts.filter((t) => {
        if (seen.has(t)) return false;
        seen.add(t);
        return true;
      });

      selects.push({
        kind: 'element-plus',
        index: i,
        label,
        options
      });
    }

    const screenshotPath = `${screensDir}/${routeToFileStem(route)}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const missingObviousFields =
      pageInfo.labels.length === 0 && (pageInfo.alerts.length > 0 || pageInfo.placeholderHits.length > 0);

    results.push({
      route,
      url,
      title: pageInfo.title,
      screenshot: screenshotPath,
      labels: pageInfo.labels,
      selects,
      alerts: pageInfo.alerts,
      placeholderHits: pageInfo.placeholderHits,
      missingObviousFields
    });
  }

  const report = {
    baseOrigin: BASE_ORIGIN,
    outDir,
    routes: ROUTES,
    pages: results,
    diagnostics: {
      console: {
        total: consoleEvents.length,
        errors: consoleEvents.filter((e) => e.type === 'error')
      },
      pageErrors,
      requestFailures
    }
  };

  await writeJson(`${outDir}/report.json`, report);
  await browser.close();

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(report, null, 2));
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

