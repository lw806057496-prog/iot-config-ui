<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">系统时间</div>
      <div class="page-subtitle">配置时区与设备时间同步方式。</div>
    </div>

    <el-card class="card" shadow="never">
      <template #header><span>时区</span></template>
      <el-form label-width="140px">
        <el-form-item label="时区">
          <el-select v-model="form.timezone" style="width: 320px">
            <el-option label="UTC+8 (Asia/Shanghai)" value="Asia/Shanghai" />
            <el-option label="UTC+0 (UTC)" value="UTC" />
            <el-option label="UTC+9 (Asia/Tokyo)" value="Asia/Tokyo" />
            <el-option label="UTC-5 (America/New_York)" value="America/New_York" />
            <el-option label="UTC-8 (America/Los_Angeles)" value="America/Los_Angeles" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card" shadow="never">
      <template #header><span>设置时间</span></template>
      <el-form label-width="140px">
        <el-form-item label="时间设置方式">
          <el-radio-group v-model="form.timeSetMode">
            <el-radio label="browser">同步浏览器时间</el-radio>
            <el-radio label="device">设备时间</el-radio>
            <el-radio label="custom">自定义设置</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <template v-if="form.timeSetMode === 'browser'">
          <el-form-item label="浏览器时间">
            <el-input :value="browserTime" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="syncBrowserTime">同步到设备</el-button>
          </el-form-item>
        </template>

        <template v-if="form.timeSetMode === 'device'">
          <el-form-item label="设备时间">
            <el-input :value="deviceTime" style="width: 360px" disabled />
          </el-form-item>
        </template>

        <template v-if="form.timeSetMode === 'custom'">
          <el-form-item label="日期时间">
            <el-date-picker
              v-model="form.customTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 360px"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setCustomTime">设置时间</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-card>

    <el-card class="card" shadow="never">
      <el-form label-width="140px">
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

const form = reactive({
  timezone: 'Asia/Shanghai',
  timeSetMode: 'browser',
  customTime: new Date()
});

const browserTime = ref('');
const deviceTime = ref('');

const updateBrowserTime = () => {
  const now = new Date();
  browserTime.value = now.toLocaleString('zh-CN', { hour12: false });
};

const updateDeviceTime = () => {
  // 模拟设备时间
  const now = new Date();
  deviceTime.value = now.toLocaleString('zh-CN', { hour12: false });
};

onMounted(() => {
  updateBrowserTime();
  updateDeviceTime();
  setInterval(() => {
    updateBrowserTime();
    updateDeviceTime();
  }, 1000);
});

const syncBrowserTime = () => {
  window.alert('已同步浏览器时间到设备（示例页面，待接入接口）');
};

const setCustomTime = () => {
  window.alert('已设置自定义时间（示例页面，待接入接口）');
};

const save = () => {
  window.alert('已保存系统时间配置（示例页面，待接入接口）');
};
</script>

<style scoped>
.page {
  padding: 16px;
}
.page-header {
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.page-subtitle {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}
.card {
  margin-top: 16px;
}
</style>

