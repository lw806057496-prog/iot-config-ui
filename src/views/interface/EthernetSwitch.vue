<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">网口开关</div>
      <div class="page-subtitle">配置以太网端口启用/禁用。</div>
    </div>

    <el-card class="card" shadow="never">
      <el-form label-width="140px">
        <el-form-item label="LAN1">
          <el-switch v-model="form.lan1" />
        </el-form-item>
        <el-form-item label="LAN2">
          <el-switch v-model="form.lan2" />
        </el-form-item>
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
  lan1: true,
  lan2: true
});

const save = () => {
  window.alert('已保存（示例页面，待接入接口）');
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

