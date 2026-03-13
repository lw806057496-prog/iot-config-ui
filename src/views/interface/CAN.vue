<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">CAN接口</div>
      <div class="page-subtitle">配置CAN/CANFD总线参数和透传地址。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>CAN开关</span></template>
      <el-form label-width="180px">
        <el-form-item label="CAN开关">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">打开</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <template v-if="form.enabled">
      <el-card class="card" shadow="never">
        <template #header><span>CAN参数</span></template>
        <el-form label-width="180px">
          <el-form-item label="协议">
            <el-radio-group v-model="form.protocol">
              <el-radio label="CAN">CAN</el-radio>
              <el-radio label="CANFD">CAN FD</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="帧类型">
            <el-select v-model="form.frameType" style="width: 260px">
              <el-option label="标准帧" value="standard" />
              <el-option label="扩展帧" value="extended" />
            </el-select>
          </el-form-item>
          <el-form-item label="CAN ID">
            <el-input v-model="form.canId" style="width: 260px" placeholder="例如: 0x123" />
          </el-form-item>
          <el-form-item label="CAN工作模式">
            <el-select v-model="form.workMode" style="width: 260px">
              <el-option label="正常模式" value="normal" />
              <el-option label="环回模式" value="loopback" />
              <el-option label="静默模式" value="silent" />
            </el-select>
          </el-form-item>
          <el-form-item label="CAN波特率">
            <el-radio-group v-model="form.baudRateType">
              <el-radio label="preset">常规波特率</el-radio>
              <el-radio label="custom">自定义波特率</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.baudRateType === 'preset'">
            <template v-if="form.protocol === 'CAN'">
              <el-form-item label="">
                <el-select v-model="form.presetBaudRate" style="width: 260px">
                  <el-option label="5K" :value="5" />
                  <el-option label="10K" :value="10" />
                  <el-option label="20K" :value="20" />
                  <el-option label="50K" :value="50" />
                  <el-option label="100K" :value="100" />
                  <el-option label="120K" :value="120" />
                  <el-option label="125K" :value="125" />
                  <el-option label="150K" :value="150" />
                  <el-option label="200K" :value="200" />
                  <el-option label="250K" :value="250" />
                  <el-option label="400K" :value="400" />
                  <el-option label="500K" :value="500" />
                  <el-option label="600K" :value="600" />
                  <el-option label="750K" :value="750" />
                  <el-option label="1000K" :value="1000" />
                </el-select>
              </el-form-item>
            </template>
            <template v-if="form.protocol === 'CANFD'">
              <el-form-item label="仲裁域波特率">
                <el-select v-model="form.arbitrationBaudRate" style="width: 260px">
                  <el-option label="125K" :value="125" />
                  <el-option label="250K" :value="250" />
                  <el-option label="500K" :value="500" />
                  <el-option label="1000K" :value="1000" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据域波特率">
                <el-select v-model="form.dataBaudRate" style="width: 260px">
                  <el-option label="1M" :value="1000" />
                  <el-option label="2M" :value="2000" />
                  <el-option label="4M" :value="4000" />
                  <el-option label="5M" :value="5000" />
                </el-select>
              </el-form-item>
            </template>
          </template>
          <template v-if="form.baudRateType === 'custom'">
            <template v-if="form.protocol === 'CAN'">
              <el-alert title="波特率计算方式：波特率=60M/[(1+BS1+BS2)*BRP]" type="info" :closable="false" style="margin-bottom: 16px" />
              <el-form-item label="BS1 (1~16)">
                <el-input-number v-model="form.customBS1" :min="1" :max="16" />
              </el-form-item>
              <el-form-item label="BS2 (1~8)">
                <el-input-number v-model="form.customBS2" :min="1" :max="8" />
              </el-form-item>
              <el-form-item label="BRP (1~1024)">
                <el-input-number v-model="form.customBRP" :min="1" :max="1024" />
              </el-form-item>
            </template>
            <template v-if="form.protocol === 'CANFD'">
              <el-alert title="波特率计算方式：CLK / [(BS1+ BS2+1 )] * (BRP)，CLK=80M" type="info" :closable="false" style="margin-bottom: 16px" />
              <el-divider content-position="left">仲裁域波特率</el-divider>
              <el-form-item label="BRP (1~128)">
                <el-input-number v-model="form.arbBRP" :min="1" :max="128" />
              </el-form-item>
              <el-form-item label="BS1 (2~256)">
                <el-input-number v-model="form.arbBS1" :min="2" :max="256" />
              </el-form-item>
              <el-form-item label="BS2 (2~128)">
                <el-input-number v-model="form.arbBS2" :min="2" :max="128" />
              </el-form-item>
              <el-form-item label="SJW (1~512)">
                <el-input-number v-model="form.arbSJW" :min="1" :max="512" />
              </el-form-item>
              <el-divider content-position="left">数据域波特率</el-divider>
              <el-form-item label="BRP (0~15)">
                <el-input-number v-model="form.dataBRP" :min="0" :max="15" />
              </el-form-item>
              <el-form-item label="BS1 (2~31)">
                <el-input-number v-model="form.dataBS1" :min="2" :max="31" />
              </el-form-item>
              <el-form-item label="BS2 (0~15)">
                <el-input-number v-model="form.dataBS2" :min="0" :max="15" />
              </el-form-item>
              <el-form-item label="SJW (1~32)">
                <el-input-number v-model="form.dataSJW" :min="1" :max="32" />
              </el-form-item>
            </template>
          </template>
          <el-form-item label="分包时间">
            <el-input-number v-model="form.packTime" :min="0" :max="10000" /><span class="inline-unit">ms</span>
          </el-form-item>
          <el-form-item label="分包帧数">
            <el-input-number v-model="form.packFrames" :min="1" :max="100" />
          </el-form-item>
          <template v-if="form.protocol === 'CANFD'">
            <el-form-item label="CANFD加速">
              <el-radio-group v-model="form.canfdAccel">
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <el-form-item label="CAN电阻使能">
            <el-switch v-model="form.resistorEnabled" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>CAN透传地址</span></template>
        <el-form label-width="180px">
          <el-form-item label="工作模式">
            <el-radio-group v-model="form.transMode">
              <el-radio label="host">主机模式</el-radio>
              <el-radio label="slave">从机模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="本机地址">
            <el-input v-model="form.localAddr" style="width: 360px" placeholder="例如: 192.168.1.100:8080" />
          </el-form-item>
          <template v-if="form.transMode === 'host'">
            <el-form-item v-for="i in 8" :key="i" :label="`他机地址${i}`">
              <el-input v-model="form.remoteAddrs[i-1]" style="width: 360px" :placeholder="`例如: 192.168.1.${100+i}:8080`" />
            </el-form-item>
          </template>
          <template v-if="form.transMode === 'slave'">
            <el-form-item label="他机地址">
              <el-input v-model="form.remoteAddr" style="width: 360px" placeholder="例如: 192.168.1.1:8080" />
            </el-form-item>
          </template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <el-form label-width="180px">
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="reset">重置</el-button>
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
  protocol: 'CAN',
  frameType: 'standard',
  canId: '',
  workMode: 'normal',
  baudRateType: 'preset',
  presetBaudRate: 500,
  arbitrationBaudRate: 500,
  dataBaudRate: 2000,
  customBS1: 8,
  customBS2: 4,
  customBRP: 10,
  arbBRP: 1,
  arbBS1: 16,
  arbBS2: 8,
  arbSJW: 4,
  dataBRP: 1,
  dataBS1: 8,
  dataBS2: 4,
  dataSJW: 2,
  packTime: 100,
  packFrames: 10,
  canfdAccel: false,
  resistorEnabled: false,
  transMode: 'host',
  localAddr: '',
  remoteAddrs: ['', '', '', '', '', '', '', ''],
  remoteAddr: ''
});
const save = () => { window.alert('已保存CAN配置（示例页面，待接入接口）'); };
const reset = () => {
  Object.assign(form, {
    enabled: true,
    protocol: 'CAN',
    frameType: 'standard',
    canId: '',
    workMode: 'normal',
    baudRateType: 'preset',
    presetBaudRate: 500,
    arbitrationBaudRate: 500,
    dataBaudRate: 2000,
    customBS1: 8,
    customBS2: 4,
    customBRP: 10,
    arbBRP: 1,
    arbBS1: 16,
    arbBS2: 8,
    arbSJW: 4,
    dataBRP: 1,
    dataBS1: 8,
    dataBS2: 4,
    dataSJW: 2,
    packTime: 100,
    packFrames: 10,
    canfdAccel: false,
    resistorEnabled: false,
    transMode: 'host',
    localAddr: '',
    remoteAddrs: ['', '', '', '', '', '', '', ''],
    remoteAddr: ''
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
</style>
