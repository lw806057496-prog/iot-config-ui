<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">网口</div>
      <div class="page-subtitle">配置以太网端口启用/禁用及工作模式。</div>
    </div>

    <el-card class="card" shadow="never">
      <template #header>
        <span>网口开关</span>
      </template>
      <el-form label-width="140px">
        <el-form-item label="网口开关">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">打开</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <template v-if="form.enabled">
          <el-form-item label="网口模式">
            <el-radio-group v-model="form.mode">
              <el-radio label="bridge">网口桥接</el-radio>
            </el-radio-group>
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
  enabled: true,
  mode: 'bridge'
});

const save = () => {
  window.alert('已保存网口配置（示例页面，待接入接口）');
};

const reset = () => {
  form.enabled = true;
  form.mode = 'bridge';
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

