import { chromium } from 'playwright';

const BASE_URL = process.env.UI_URL || 'http://localhost:5173/#/';
const OUT_DIR = process.env.UI_OUT_DIR || 'artifacts/ui-smoke';

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

async function mkdirp(path) {
  const { mkdir } = await import('node:fs/promises');
  await mkdir(path, { recursive: true });
}

async function run() {
  const stamp = nowStamp();
  const outDir = `${OUT_DIR}/${stamp}`;
  await mkdirp(outDir);

  const consoleEvents = [];
  const pageErrors = [];
  const requestFailures = [];

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1365, height: 768 } });
  const page = await context.newPage();

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
      failure: req.failure()?.errorText || 'unknown',
      method: req.method()
    });
  });

  const clickByText = async (text) => {
    const loc = page.getByText(text, { exact: true });
    await loc.first().click({ timeout: 15000 });
  };

  const waitForMainTitle = async () => {
    const title = page.locator('.page-title');
    await title.first().waitFor({ timeout: 15000 });
    return (await title.first().innerText()).trim();
  };

  const assertNotBlank = async (label) => {
    const main = page.locator('.content');
    const box = await main.boundingBox();
    if (!box || box.width < 50 || box.height < 50) {
      throw new Error(`Main content area looks blank for: ${label}`);
    }
    const text = (await main.innerText()).trim();
    if (text.length < 3) {
      throw new Error(`Main content has too little text for: ${label}`);
    }
  };

  // Load overview
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('.layout-root').waitFor({ timeout: 15000 });
  await assertNotBlank('initial load');
  await page.screenshot({ path: `${outDir}/01-overview.png`, fullPage: true });

  // Click top tabs
  await clickByText('网络');
  await assertNotBlank('top tab: 网络');
  const networkTitle1 = await waitForMainTitle();

  // Click a few side menu items under 网络
  await clickByText('LAN');
  await assertNotBlank('side menu: LAN');
  const networkTitle2 = await waitForMainTitle();
  await page.screenshot({ path: `${outDir}/02-network-lan.png`, fullPage: true });

  await clickByText('网络诊断');
  await assertNotBlank('side menu: 网络诊断');
  await waitForMainTitle();

  await clickByText('接口');
  await assertNotBlank('top tab: 接口');
  await waitForMainTitle();

  await clickByText('系统');
  await assertNotBlank('top tab: 系统');
  await waitForMainTitle();

  const errorsOnly = consoleEvents.filter((e) => e.type === 'error');

  const report = {
    baseUrl: BASE_URL,
    outDir,
    visited: {
      networkFirstTitle: networkTitle1,
      networkLanTitle: networkTitle2
    },
    console: {
      total: consoleEvents.length,
      errors: errorsOnly
    },
    pageErrors,
    requestFailures
  };

  const { writeFile } = await import('node:fs/promises');
  await writeFile(`${outDir}/report.json`, JSON.stringify(report, null, 2), 'utf8');

  await browser.close();

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(report, null, 2));
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

