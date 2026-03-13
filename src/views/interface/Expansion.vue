<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">拓展机接口</div>
      <div class="page-subtitle">配置拓展机接口参数。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>拓展机配置</span></template>
      <el-form label-width="160px">
        <el-form-item label="拓展机使能">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <template v-if="form.enabled">
          <el-form-item label="拓展机地址">
            <el-input v-model="form.address" style="width: 360px" placeholder="例如: 192.168.1.200:8080" />
          </el-form-item>
          <el-form-item label="通信协议">
            <el-select v-model="form.protocol" style="width: 260px">
              <el-option label="TCP" value="tcp" />
              <el-option label="UDP" value="udp" />
              <el-option label="串口" value="serial" />
            </el-select>
          </el-form-item>
          <el-form-item label="心跳间隔">
            <el-input-number v-model="form.heartbeatInterval" :min="1" :max="3600" /><span class="inline-unit">秒</span>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
const form = reactive({
  enabled: false,
  address: '',
  protocol: 'tcp',
  heartbeatInterval: 60
});
const save = () => { window.alert('已保存拓展机配置（示例页面，待接入接口）'); };
const reset = () => {
  form.enabled = false;
  form.address = '';
  form.protocol = 'tcp';
  form.heartbeatInterval = 60;
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
