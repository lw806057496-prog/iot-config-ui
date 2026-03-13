<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">LAN</div>
      <div class="page-subtitle">配置 LAN 口网络参数。</div>
    </div>

    <el-card class="card" shadow="never">
      <el-form label-width="140px">
        <el-form-item label="网络模式">
          <el-select v-model="form.mode" style="width: 260px">
            <el-option label="静态IP" value="static" />
            <el-option label="DHCP" value="dhcp" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.mode === 'static'" label="IP地址">
          <el-input v-model="form.ip" style="width: 240px" />
        </el-form-item>
        <el-form-item v-if="form.mode === 'static'" label="子网掩码">
          <el-input v-model="form.mask" style="width: 240px" />
        </el-form-item>
        <el-form-item v-if="form.mode === 'static'" label="网关">
          <el-input v-model="form.gateway" style="width: 240px" />
        </el-form-item>
        <el-form-item label="DNS">
          <el-input v-model="form.dns" style="width: 240px" />
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
  mode: 'static',
  ip: '192.168.1.2',
  mask: '255.255.255.0',
  gateway: '192.168.1.1',
  dns: '114.114.114.114'
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

