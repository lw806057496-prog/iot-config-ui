<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">系统时间</div>
      <div class="page-subtitle">配置时区与设备时间同步方式。</div>
    </div>

    <el-card class="card" shadow="never">
      <el-form label-width="140px">
        <el-form-item label="时区">
          <el-select v-model="form.tz" style="width: 320px">
            <el-option label="Asia/Shanghai" value="Asia/Shanghai" />
            <el-option label="UTC" value="UTC" />
          </el-select>
        </el-form-item>
        <el-form-item label="NTP 同步">
          <el-switch v-model="form.ntp" />
        </el-form-item>
        <el-form-item v-if="form.ntp" label="NTP 服务器">
          <el-input v-model="form.ntpServer" style="width: 360px" />
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
  tz: 'Asia/Shanghai',
  ntp: true,
  ntpServer: 'pool.ntp.org'
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

