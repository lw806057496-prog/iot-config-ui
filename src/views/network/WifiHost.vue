<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">WiFi网络</div>
      <div class="page-subtitle">配置 WiFi 连接参数。</div>
    </div>

    <el-card class="card" shadow="never">
      <el-form label-width="140px">
        <el-form-item label="SSID">
          <el-input v-model="form.ssid" style="width: 360px" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password style="width: 360px" />
        </el-form-item>
        <el-form-item label="DHCP">
          <el-switch v-model="form.dhcp" />
        </el-form-item>
        <el-form-item v-if="!form.dhcp" label="静态 IP">
          <el-input v-model="form.ip" style="width: 240px" />
        </el-form-item>
        <el-form-item v-if="!form.dhcp" label="子网掩码">
          <el-input v-model="form.mask" style="width: 240px" />
        </el-form-item>
        <el-form-item v-if="!form.dhcp" label="网关">
          <el-input v-model="form.gateway" style="width: 240px" />
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
  ssid: '',
  password: '',
  dhcp: true,
  ip: '192.168.1.10',
  mask: '255.255.255.0',
  gateway: '192.168.1.1'
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

