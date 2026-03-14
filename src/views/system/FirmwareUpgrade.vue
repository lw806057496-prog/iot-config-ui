<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">固件升级</div>
      <div class="page-subtitle">查看当前固件版本并进行固件升级。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>固件信息</span></template>
      <el-form label-width="140px">
        <el-form-item label="当前版本">
          <el-input v-model="currentVersion" style="width: 360px" disabled />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>固件升级</span></template>
      <el-form label-width="140px">
        <el-form-item label="选择文件">
          <input ref="fileInput" type="file" accept=".bin,.hex,.fw" style="display: none" @change="handleFileSelect" />
          <el-button type="primary" @click="selectFile">选择文件</el-button>
          <span v-if="selectedFile" class="form-tip">已选择: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})</span>
        </el-form-item>
        <el-form-item v-if="selectedFile">
          <el-button type="danger" @click="startUpgrade" :loading="upgrading">{{ upgrading ? '升级中...' : '开始升级' }}</el-button>
          <el-button @click="cancelUpgrade" :disabled="upgrading">取消</el-button>
        </el-form-item>
        <el-form-item v-if="upgrading">
          <el-progress :percentage="upgradeProgress" :status="upgradeProgress === 100 ? 'success' : undefined" />
        </el-form-item>
      </el-form>
      <el-alert v-if="selectedFile" title="注意：升级过程中请勿断电或关闭页面，升级完成后设备将自动重启" type="warning" :closable="false" />
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const currentVersion = ref('v1.0.0-20260314');
const fileInput = ref(null);
const selectedFile = ref(null);
const upgrading = ref(false);
const upgradeProgress = ref(0);
const selectFile = () => {
  fileInput.value.click();
};
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};
const startUpgrade = () => {
  if (!selectedFile.value) {
    window.alert('请先选择固件文件');
    return;
  }
  if (confirm('确定要升级固件吗？升级过程中设备将重启！')) {
    upgrading.value = true;
    upgradeProgress.value = 0;
    const interval = setInterval(() => {
      upgradeProgress.value += 10;
      if (upgradeProgress.value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          upgrading.value = false;
          window.alert('固件升级完成，设备即将重启（示例页面，待接入接口）');
          selectedFile.value = null;
          fileInput.value.value = '';
          upgradeProgress.value = 0;
        }, 500);
      }
    }, 500);
  }
};
const cancelUpgrade = () => {
  selectedFile.value = null;
  fileInput.value.value = '';
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.form-tip { margin-left: 12px; color: #909399; font-size: 12px; }
</style>
