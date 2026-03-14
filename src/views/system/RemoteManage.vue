<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">远程管理</div>
      <div class="page-subtitle">配置远程AT指令和HTTP获取功能。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>远程AT</span></template>
      <el-form label-width="140px">
        <el-form-item label="远程AT">
          <el-switch v-model="remoteAt.enabled" />
        </el-form-item>
        <template v-if="remoteAt.enabled">
          <el-form-item label="服务器地址">
            <el-input v-model="remoteAt.serverAddr" style="width: 360px" placeholder="例如: 192.168.1.100" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input-number v-model="remoteAt.port" :min="1" :max="65535" />
          </el-form-item>
        </template>
      </el-form>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>HTTP获取</span></template>
      <el-form label-width="140px">
        <el-form-item label="HTTP获取">
          <el-switch v-model="httpGet.enabled" />
        </el-form-item>
        <template v-if="httpGet.enabled">
          <el-form-item label="URL地址">
            <el-input v-model="httpGet.url" style="width: 360px" placeholder="例如: http://192.168.1.100/api/config" />
          </el-form-item>
          <el-form-item label="获取间隔">
            <el-input-number v-model="httpGet.interval" :min="1" :max="3600" /><span class="inline-unit">秒</span>
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
import { reactive } from 'vue';
const remoteAt = reactive({
  enabled: false,
  serverAddr: '',
  port: 8080
});
const httpGet = reactive({
  enabled: false,
  url: '',
  interval: 60
});
const save = () => {
  window.alert('已保存远程管理配置（示例页面，待接入接口）');
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
