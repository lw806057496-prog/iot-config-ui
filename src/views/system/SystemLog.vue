<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">系统日志</div>
      <div class="page-subtitle">查看和管理系统日志，配置远程日志服务器。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>本地日志</span></template>
      <el-form label-width="120px">
        <el-form-item label="日志">
          <div class="log-box">
            <pre v-if="logs.length > 0">{{ logs.join('\n') }}</pre>
            <div v-else class="empty-log">暂无日志</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryLogs">查询</el-button>
          <el-button @click="clearLogs">清空</el-button>
          <el-button @click="downloadLogs">下载日志</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>远程日志</span></template>
      <el-form label-width="160px">
        <el-form-item label="UDP日志">
          <el-switch v-model="remoteLog.enabled" />
        </el-form-item>
        <template v-if="remoteLog.enabled">
          <el-form-item label="远程服务器地址">
            <el-input v-model="remoteLog.serverAddr" style="width: 360px" placeholder="例如: 192.168.1.100" />
          </el-form-item>
          <el-form-item label="远程服务器端口">
            <el-input-number v-model="remoteLog.serverPort" :min="1" :max="65535" />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="saveRemoteLog">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
const logs = ref([
  '[2026-03-14 10:23:45] 系统启动成功',
  '[2026-03-14 10:24:12] WiFi连接成功: AP520X-C-1114',
  '[2026-03-14 10:25:30] RS485接口初始化完成',
  '[2026-03-14 10:26:18] CAN总线通信正常',
  '[2026-03-14 10:27:05] 网络连接建立: 192.168.1.100'
]);
const remoteLog = reactive({
  enabled: false,
  serverAddr: '',
  serverPort: 514
});
const queryLogs = () => {
  window.alert('正在查询日志...（示例页面，待接入接口）');
};
const clearLogs = () => {
  if (confirm('确定要清空所有日志吗？')) {
    logs.value = [];
    window.alert('日志已清空');
  }
};
const downloadLogs = () => {
  const content = logs.value.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `system-log-${new Date().getTime()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
const saveRemoteLog = () => {
  window.alert('已保存远程日志配置（示例页面，待接入接口）');
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.log-box { background: #F5F7FA; border: 1px solid #EBEEF5; border-radius: 4px; padding: 16px; min-height: 300px; max-height: 500px; overflow-y: auto; }
.log-box pre { margin: 0; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.8; color: #303133; white-space: pre-wrap; word-wrap: break-word; }
.empty-log { color: #909399; text-align: center; padding: 100px 0; font-size: 14px; }
</style>
