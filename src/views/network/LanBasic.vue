<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">LAN</div>
      <div class="page-subtitle">配置 LAN 口网络参数。</div>
    </div>

    <!-- 基础信息 -->
    <el-card class="card" shadow="never">
      <template #header>
        <span>基础信息</span>
      </template>
      <el-form label-width="140px">
        <el-form-item label="IP">
          <el-input v-model="basicInfo.ip" style="width: 360px" disabled />
        </el-form-item>
        <el-form-item label="MAC">
          <el-input v-model="basicInfo.mac" style="width: 360px" disabled />
        </el-form-item>
        <el-form-item label="子网掩码">
          <el-input v-model="basicInfo.mask" style="width: 360px" disabled />
        </el-form-item>
        <el-form-item label="连接时间">
          <el-input v-model="basicInfo.connectTime" style="width: 360px" disabled />
        </el-form-item>
        <el-form-item label="接收">
          <el-input v-model="basicInfo.rx" style="width: 360px" disabled />
        </el-form-item>
        <el-form-item label="发送">
          <el-input v-model="basicInfo.tx" style="width: 360px" disabled />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 配置 -->
    <el-card class="card" shadow="never">
      <template #header>
        <span>配置</span>
      </template>
      <el-form label-width="140px">
        <el-form-item label="IP类型">
          <el-radio-group v-model="config.ipType">
            <el-radio label="static">静态IP</el-radio>
            <el-radio label="dhcp">动态获取</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 静态IP配置 -->
        <template v-if="config.ipType === 'static'">
          <el-form-item label="IP地址">
            <el-input v-model="config.staticIp" style="width: 360px" placeholder="例如: 192.168.1.100" />
          </el-form-item>
          <el-form-item label="子网掩码">
            <el-input v-model="config.staticMask" style="width: 360px" placeholder="例如: 255.255.255.0" />
          </el-form-item>
          <el-form-item label="默认网关">
            <el-input v-model="config.gateway" style="width: 360px" placeholder="例如: 192.168.1.1" />
          </el-form-item>
          <el-form-item label="首选DNS服务器">
            <el-input v-model="config.primaryDns" style="width: 360px" placeholder="例如: 8.8.8.8" />
          </el-form-item>
          <el-form-item label="备用DNS服务器">
            <el-input v-model="config.secondaryDns" style="width: 360px" placeholder="例如: 8.8.4.4" />
          </el-form-item>
        </template>

        <!-- 动态获取配置 -->
        <template v-if="config.ipType === 'dhcp'">
          <el-form-item label="DHCP租约">
            <div style="display: flex; gap: 8px; align-items: center;">
              <el-input v-model="config.dhcpLease" style="width: 260px" disabled />
              <el-button type="primary" @click="renewDhcp">更新</el-button>
            </div>
          </el-form-item>
          <el-form-item label="DHCP的IP地址回落">
            <el-radio-group v-model="config.dhcpFallback">
              <el-radio :label="true">打开</el-radio>
              <el-radio :label="false">关闭</el-radio>
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

// 基础信息（只读）
const basicInfo = reactive({
  ip: '192.168.1.100',
  mac: 'AA:BB:CC:DD:EE:FF',
  mask: '255.255.255.0',
  connectTime: '02:15:30',
  rx: '1.2 GB',
  tx: '856 MB'
});

// 配置信息
const config = reactive({
  ipType: 'static',
  // 静态IP配置
  staticIp: '192.168.1.100',
  staticMask: '255.255.255.0',
  gateway: '192.168.1.1',
  primaryDns: '8.8.8.8',
  secondaryDns: '8.8.4.4',
  // DHCP配置
  dhcpLease: '剩余 23:45:12',
  dhcpFallback: false
});

const renewDhcp = () => {
  window.alert('正在更新DHCP租约...');
};

const save = () => {
  window.alert('已保存LAN配置（示例页面，待接入接口）');
};

const reset = () => {
  config.ipType = 'static';
  config.staticIp = '192.168.1.100';
  config.staticMask = '255.255.255.0';
  config.gateway = '192.168.1.1';
  config.primaryDns = '8.8.8.8';
  config.secondaryDns = '8.8.4.4';
  config.dhcpFallback = false;
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

