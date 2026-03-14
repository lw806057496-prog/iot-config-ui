<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">配置管理</div>
      <div class="page-subtitle">导出、导入配置文件或恢复出厂设置。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>配置管理</span></template>
      <el-form label-width="140px">
        <el-form-item label="导出配置">
          <el-button type="primary" @click="exportConfig">导出</el-button>
          <span class="form-tip">导出当前设备的所有配置参数</span>
        </el-form-item>
        <el-form-item label="导入配置">
          <input ref="fileInput" type="file" accept=".json,.conf" style="display: none" @change="handleFileSelect" />
          <el-button type="primary" @click="selectFile">选择文件</el-button>
          <el-button v-if="selectedFile" @click="importConfig">导入</el-button>
          <span v-if="selectedFile" class="form-tip">已选择: {{ selectedFile.name }}</span>
        </el-form-item>
        <el-divider />
        <el-form-item label="恢复出厂设置">
          <el-button type="danger" @click="factoryReset">恢复出厂设置</el-button>
          <span class="form-tip warning">警告：此操作将清除所有配置，恢复到出厂状态</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const fileInput = ref(null);
const selectedFile = ref(null);
const exportConfig = () => {
  const config = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    network: { wifi: {}, sle: {}, lan: {} },
    interface: { ethernet: {}, rs485: {}, can: {}, dido: {} },
    system: { timezone: 'Asia/Shanghai', time: {} }
  };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `device-config-${new Date().getTime()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  window.alert('配置已导出');
};
const selectFile = () => {
  fileInput.value.click();
};
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};
const importConfig = () => {
  if (!selectedFile.value) {
    window.alert('请先选择配置文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target.result);
      window.alert('配置导入成功（示例页面，待接入接口）');
      selectedFile.value = null;
      fileInput.value.value = '';
    } catch (err) {
      window.alert('配置文件格式错误');
    }
  };
  reader.readAsText(selectedFile.value);
};
const factoryReset = () => {
  if (confirm('确定要恢复出厂设置吗？此操作将清除所有配置！')) {
    if (confirm('再次确认：恢复出厂设置后设备将重启，所有配置将丢失！')) {
      window.alert('正在恢复出厂设置...（示例页面，待接入接口）');
    }
  }
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.form-tip { margin-left: 12px; color: #909399; font-size: 12px; }
.form-tip.warning { color: #F56C6C; }
</style>
