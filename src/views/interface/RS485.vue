<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">RS485接口</div>
      <div class="page-subtitle">配置RS485串口参数和透传地址。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>RS485开关</span></template>
      <el-form label-width="160px">
        <el-form-item label="RS485开关">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">打开</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <template v-if="form.enabled">
      <el-card class="card" shadow="never">
        <template #header><span>RS485参数</span></template>
        <el-form label-width="160px">
          <el-form-item label="波特率">
            <el-select v-model="form.baudRate" style="width: 260px">
              <el-option label="1200" :value="1200" />
              <el-option label="2400" :value="2400" />
              <el-option label="4800" :value="4800" />
              <el-option label="9600" :value="9600" />
              <el-option label="19200" :value="19200" />
              <el-option label="38400" :value="38400" />
              <el-option label="57600" :value="57600" />
              <el-option label="115200" :value="115200" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据位">
            <el-select v-model="form.dataBits" style="width: 260px">
              <el-option label="5" :value="5" />
              <el-option label="6" :value="6" />
              <el-option label="7" :value="7" />
              <el-option label="8" :value="8" />
            </el-select>
          </el-form-item>
          <el-form-item label="停止位">
            <el-select v-model="form.stopBits" style="width: 260px">
              <el-option label="1" :value="1" />
              <el-option label="1.5" :value="1.5" />
              <el-option label="2" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="校验位">
            <el-select v-model="form.parity" style="width: 260px">
              <el-option label="无" value="none" />
              <el-option label="奇校验" value="odd" />
              <el-option label="偶校验" value="even" />
            </el-select>
          </el-form-item>
          <el-form-item label="打包时间">
            <el-input-number v-model="form.packTime" :min="0" :max="10000" /><span class="inline-unit">ms</span>
          </el-form-item>
          <el-form-item label="打包长度">
            <el-input-number v-model="form.packLength" :min="1" :max="2048" /><span class="inline-unit">字节</span>
          </el-form-item>
          <el-form-item label="485防冲突使能">
            <el-switch v-model="form.antiCollision" />
          </el-form-item>
          <template v-if="form.antiCollision">
            <el-form-item label="485防冲突空闲时间">
              <el-input-number v-model="form.antiCollisionIdleTime" :min="0" :max="1000" /><span class="inline-unit">ms</span>
            </el-form-item>
          </template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>RS485透传地址</span></template>
        <el-form label-width="160px">
          <el-form-item label="工作模式">
            <el-radio-group v-model="form.workMode">
              <el-radio label="host">主机模式</el-radio>
              <el-radio label="slave">从机模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="本机地址">
            <el-input v-model="form.localAddr" style="width: 360px" placeholder="例如: AA:BB:CC:DD:EE:FF" />
          </el-form-item>
          <template v-if="form.workMode === 'host'">
            <el-form-item v-for="i in 8" :key="i" :label="`他机地址${i}`">
              <el-input v-model="form.remoteAddrs[i-1]" style="width: 360px" :placeholder="`例如: AA:BB:CC:DD:EE:0${i}`" />
            </el-form-item>
          </template>
          <template v-if="form.workMode === 'slave'">
            <el-form-item label="他机地址">
              <el-input v-model="form.remoteAddr" style="width: 360px" placeholder="例如: AA:BB:CC:DD:EE:FF" />
            </el-form-item>
          </template>
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
const form = reactive({
  enabled: true,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  packTime: 100,
  packLength: 512,
  antiCollision: false,
  antiCollisionIdleTime: 10,
  workMode: 'host',
  localAddr: '',
  remoteAddrs: ['', '', '', '', '', '', '', ''],
  remoteAddr: ''
});
const save = () => { window.alert('已保存RS485配置（示例页面，待接入接口）'); };
const reset = () => {
  form.enabled = true;
  form.baudRate = 9600;
  form.dataBits = 8;
  form.stopBits = 1;
  form.parity = 'none';
  form.packTime = 100;
  form.packLength = 512;
  form.antiCollision = false;
  form.antiCollisionIdleTime = 10;
  form.workMode = 'host';
  form.localAddr = '';
  form.remoteAddrs = ['', '', '', '', '', '', '', ''];
  form.remoteAddr = '';
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.inline-unit { margin-left: 8px; color: #909399; }
</style>
