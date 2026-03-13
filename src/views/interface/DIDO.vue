<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">DI/DO接口</div>
      <div class="page-subtitle">配置数字输入/输出接口参数和联动方式。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>DI/DO状态</span></template>
      <el-form label-width="160px">
        <el-form-item label="DI">
          <el-tag :type="status.di ? 'success' : 'info'">{{ status.di ? '开' : '关' }}</el-tag>
        </el-form-item>
        <el-form-item label="DO">
          <el-tag :type="status.do ? 'success' : 'info'">{{ status.do ? '闭合' : '断开' }}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>DI/DO开关</span></template>
      <el-form label-width="160px">
        <el-form-item label="DI/DO开关">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">打开</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <template v-if="form.enabled">
      <el-card class="card" shadow="never">
        <template #header><span>DI/DO配置</span></template>
        <el-form label-width="160px">
          <el-form-item label="DI滤波时间">
            <el-input-number v-model="form.diFilterTime" :min="20" :max="1000" /><span class="inline-unit">ms (20~1000)</span>
          </el-form-item>
          <el-form-item label="DI/DO联动方式">
            <el-select v-model="form.linkageMode" style="width: 260px">
              <el-option label="开关联动" value="switch" />
              <el-option label="按键联动" value="button" />
              <el-option label="计数联动" value="counter" />
            </el-select>
          </el-form-item>
          <template v-if="form.linkageMode === 'switch'">
            <el-form-item label="">
              <el-radio-group v-model="form.switchMode">
                <el-radio label="forward">DO正向跟随DI</el-radio>
                <el-radio label="reverse">DO反向联动DI</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-if="form.linkageMode === 'button'">
            <el-form-item label="DO输出">
              <el-select v-model="form.buttonOutput" style="width: 260px">
                <el-option label="翻转" value="toggle" />
                <el-option label="闭合" value="close" />
                <el-option label="断开" value="open" />
              </el-select>
            </el-form-item>
          </template>
          <template v-if="form.linkageMode === 'counter'">
            <el-form-item label="DI计数≥阈值">
              <el-radio-group v-model="form.counterGteAction">
                <el-radio label="close">DO闭合</el-radio>
                <el-radio label="open">DO断开</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="DI计数＜阈值">
              <el-radio-group v-model="form.counterLtAction">
                <el-radio label="close">DO闭合</el-radio>
                <el-radio label="open">DO断开</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="阈值">
              <el-input-number v-model="form.counterThreshold" :min="1" :max="65535" /><span class="inline-unit">s (1～65535)</span>
              <div class="form-tip">提示：大于65535时，按65535自动判断，阈值继续循环累计</div>
            </el-form-item>
            <el-form-item label="DO控制时间">
              <el-input-number v-model="form.doControlTime" :min="0" :max="65535" /><span class="inline-unit">s (0为即时动作，1～65535)</span>
            </el-form-item>
          </template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>DI/DO联动地址</span></template>
        <el-form label-width="160px">
          <el-form-item label="DO地址（本机）">
            <el-input v-model="form.doAddr" style="width: 360px" placeholder="例如: AA:BB:CC:DD:EE:FF" />
          </el-form-item>
          <el-form-item label="联动DI地址（他机）">
            <el-input v-model="form.linkageDiAddr" style="width: 360px" placeholder="例如: AA:BB:CC:DD:EE:01" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>设备重启DO状态</span></template>
        <el-form label-width="160px">
          <el-form-item label="设备重启DO状态">
            <el-radio-group v-model="form.rebootDoState">
              <el-radio label="keep">保持</el-radio>
              <el-radio label="close">闭合</el-radio>
              <el-radio label="open">断开</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <el-form label-width="160px">
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </template>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
const status = reactive({ di: false, do: false });
const form = reactive({
  enabled: true,
  diFilterTime: 100,
  linkageMode: 'switch',
  switchMode: 'forward',
  buttonOutput: 'toggle',
  counterGteAction: 'close',
  counterLtAction: 'open',
  counterThreshold: 100,
  doControlTime: 0,
  doAddr: '',
  linkageDiAddr: '',
  rebootDoState: 'keep'
});
const save = () => { window.alert('已保存DI/DO配置（示例页面，待接入接口）'); };
const reset = () => {
  Object.assign(form, {
    enabled: true,
    diFilterTime: 100,
    linkageMode: 'switch',
    switchMode: 'forward',
    buttonOutput: 'toggle',
    counterGteAction: 'close',
    counterLtAction: 'open',
    counterThreshold: 100,
    doControlTime: 0,
    doAddr: '',
    linkageDiAddr: '',
    rebootDoState: 'keep'
  });
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.inline-unit { margin-left: 8px; color: #909399; }
.status-tip { margin-left: 8px; color: #909399; font-size: 12px; }
.form-tip { margin-top: 4px; color: #909399; font-size: 12px; }
</style>
