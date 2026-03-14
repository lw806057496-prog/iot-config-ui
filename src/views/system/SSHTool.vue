<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">SSH工具</div>
      <div class="page-subtitle">配置SSH远程访问功能。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>SSH</span></template>
      <el-form label-width="140px">
        <el-form-item label="SSH">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">打开</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.enabled">
          <el-form-item label="端口">
            <el-input-number v-model="form.port" :min="1" :max="65535" />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
const form = reactive({
  enabled: false,
  port: 22
});
const save = () => {
  window.alert('已保存SSH配置（示例页面，待接入接口）');
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
</style>
