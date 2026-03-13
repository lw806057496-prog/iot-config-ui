<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">无线模式</div>
      <div class="page-subtitle">在此配置无线工作模式。</div>
    </div>

    <el-card class="card" shadow="never">
      <el-form label-width="140px">
        <el-form-item label="模式">
          <el-select v-model="form.mode" style="width: 260px">
            <el-option label="SLE" value="sle" />
            <el-option label="WiFi" value="wifi" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作模式">
          <el-select v-model="form.workMode" style="width: 260px">
            <el-option label="主机模式" value="host" />
            <el-option label="从机模式" value="client" />
            <el-option label="主从机模式" value="both" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useWirelessStore } from '../../stores/wireless';

const wirelessStore = useWirelessStore();

const defaults = { mode: 'sle', workMode: 'host' };
const form = reactive({
  mode: wirelessStore.mode || defaults.mode,
  workMode: wirelessStore.workMode || defaults.workMode
});

watch(
  () => form.mode,
  (val) => {
    wirelessStore.setMode(val);
  }
);

watch(
  () => form.workMode,
  (val) => {
    wirelessStore.setWorkMode(val);
  }
);

const save = () => {
  wirelessStore.setMode(form.mode);
  wirelessStore.setWorkMode(form.workMode);
  window.alert('已保存（示例页面，待接入接口）');
};

const reset = () => {
  Object.assign(form, defaults);
  wirelessStore.setMode(form.mode);
  wirelessStore.setWorkMode(form.workMode);
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

