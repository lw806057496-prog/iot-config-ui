<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">系统重启</div>
      <div class="page-subtitle">立即重启、定时重启或配置超时无数据重启策略。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>立即重启</span></template>
      <el-form label-width="140px">
        <el-form-item>
          <el-button type="danger" @click="rebootNow">立即重启</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>定时重启</span></template>
      <el-form label-width="160px">
        <el-form-item label="定时重启">
          <el-radio-group v-model="scheduledReboot.enabled">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">打开</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="scheduledReboot.enabled">
          <el-form-item label="重启周期">
            <el-select v-model="scheduledReboot.cycle" style="width: 260px">
              <el-option label="每月" value="monthly" />
              <el-option label="每周" value="weekly" />
              <el-option label="每三日" value="every3days" />
              <el-option label="每日" value="daily" />
            </el-select>
          </el-form-item>
          <template v-if="scheduledReboot.cycle === 'monthly'">
            <el-form-item label="日">
              <el-input-number v-model="scheduledReboot.dayOfMonth" :min="1" :max="31" />
            </el-form-item>
          </template>
          <template v-if="scheduledReboot.cycle === 'weekly'">
            <el-form-item label="星期">
              <el-select v-model="scheduledReboot.dayOfWeek" style="width: 260px">
                <el-option label="星期一" :value="1" />
                <el-option label="星期二" :value="2" />
                <el-option label="星期三" :value="3" />
                <el-option label="星期四" :value="4" />
                <el-option label="星期五" :value="5" />
                <el-option label="星期六" :value="6" />
                <el-option label="星期日" :value="0" />
              </el-select>
            </el-form-item>
          </template>
          <template v-if="scheduledReboot.cycle === 'every3days'">
            <el-alert title="备注：每三日重启为日期为3的倍数时重启" type="info" :closable="false" style="margin-bottom: 16px" />
          </template>
          <el-form-item label="随机时间">
            <el-radio-group v-model="scheduledReboot.randomTime">
              <el-radio :label="true">打开</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="scheduledReboot.randomTime">
            <el-form-item label="随机起始时间">
              <el-time-select v-model="scheduledReboot.randomStartTime" start="00:00" end="23:00" step="01:00" placeholder="选择时间" style="width: 260px" />
            </el-form-item>
            <el-form-item label="随机结束时间">
              <el-time-select v-model="scheduledReboot.randomEndTime" start="00:00" end="23:00" step="01:00" placeholder="选择时间" style="width: 260px" />
            </el-form-item>
          </template>
          <template v-if="!scheduledReboot.randomTime">
            <el-form-item label="小时">
              <el-input-number v-model="scheduledReboot.hour" :min="0" :max="23" /><span class="inline-unit">(0-23小时)</span>
            </el-form-item>
            <el-form-item label="分钟">
              <el-input-number v-model="scheduledReboot.minute" :min="0" :max="59" /><span class="inline-unit">(0-59分)</span>
            </el-form-item>
          </template>
        </template>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>超时无数据重启</span></template>
      <el-form label-width="200px">
        <el-form-item label="无线网络无数据重启使能">
          <el-radio-group v-model="timeoutReboot.wireless.enabled">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">打开</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="timeoutReboot.wireless.enabled">
          <el-form-item label="重启检测间隔时间">
            <el-input-number v-model="timeoutReboot.wireless.interval" :min="60" :max="36000" /><span class="inline-unit">秒 (60～36000，默认36000)</span>
          </el-form-item>
        </template>
        <el-divider />
        <el-form-item label="网口通道无数据重启使能">
          <el-radio-group v-model="timeoutReboot.ethernet.enabled">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="timeoutReboot.ethernet.enabled">
          <el-form-item label="重启检测间隔时间">
            <el-input-number v-model="timeoutReboot.ethernet.interval" :min="60" :max="36000" /><span class="inline-unit">秒 (60～36000，默认36000)</span>
          </el-form-item>
        </template>
        <el-divider />
        <el-form-item label="串口/CAN无数据重启使能">
          <el-radio-group v-model="timeoutReboot.serial.enabled">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="timeoutReboot.serial.enabled">
          <el-form-item label="生效串口">
            <el-select v-model="timeoutReboot.serial.port" style="width: 260px">
              <el-option label="485串行端口" value="rs485" />
              <el-option label="CAN接口" value="can" />
              <el-option label="485串行端口+CAN接口" value="both" />
            </el-select>
          </el-form-item>
          <el-form-item label="重启检测间隔时间">
            <el-input-number v-model="timeoutReboot.serial.interval" :min="60" :max="3600" /><span class="inline-unit">秒 (60～3600，默认3600)</span>
          </el-form-item>
        </template>
        <el-divider />
        <el-form-item label="DI无数据重启使能">
          <el-radio-group v-model="timeoutReboot.di.enabled">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="timeoutReboot.di.enabled">
          <el-form-item label="重启检测间隔时间">
            <el-input-number v-model="timeoutReboot.di.interval" :min="60" :max="36000" /><span class="inline-unit">秒 (60～36000，默认36000)</span>
          </el-form-item>
        </template>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <el-form label-width="200px">
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
const scheduledReboot = reactive({
  enabled: true,
  cycle: 'every3days',
  dayOfMonth: 1,
  dayOfWeek: 1,
  randomTime: true,
  randomStartTime: '04:00',
  randomEndTime: '05:00',
  hour: 4,
  minute: 0
});
const timeoutReboot = reactive({
  wireless: { enabled: false, interval: 36000 },
  ethernet: { enabled: false, interval: 36000 },
  serial: { enabled: false, port: 'rs485', interval: 3600 },
  di: { enabled: false, interval: 36000 }
});
const rebootNow = () => {
  if (confirm('确定要立即重启设备吗？')) {
    window.alert('设备正在重启...（示例页面，待接入接口）');
  }
};
const save = () => {
  window.alert('已保存系统重启配置（示例页面，待接入接口）');
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
