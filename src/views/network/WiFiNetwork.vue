<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">WiFi网络</div>
      <div class="page-subtitle">根据无线模式下的工作模式（主机/从机/主从机）配置对应的WiFi参数。</div>
    </div>
    <el-alert :title="`当前工作模式：${workModeLabel}`" type="info" show-icon :closable="false" class="mode-tip" />
    <el-dialog v-model="scanDialogVisible" title="扫描WiFi热点" width="600px">
      <div v-if="scannedAPs.length === 0" class="scan-empty"><p>未发现WiFi热点</p></div>
      <el-table v-else :data="scannedAPs" style="width: 100%" @current-change="handleAPSelection" highlight-current-row>
        <el-table-column prop="name" label="WiFi名称" width="150" />
        <el-table-column prop="mac" label="MAC地址" width="180" />
        <el-table-column prop="rssi" label="信号强度" width="100" />
      </el-table>
      <template #footer>
        <el-button @click="scanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAPSelection">确认</el-button>
      </template>
    </el-dialog>
    <template v-if="isHostMode">
      <el-card class="card" shadow="never">
        <template #header><span>热点参数设置</span></template>
        <el-form label-width="140px">
          <el-form-item label="WiFi名称"><el-input v-model="apConfig.name" style="width: 360px" /></el-form-item>
          <el-form-item label="WiFi名称隐藏"><el-switch v-model="apConfig.hidden" /></el-form-item>
          <el-form-item label="MAC地址"><el-input v-model="apConfig.mac" style="width: 360px" disabled /></el-form-item>
          <el-form-item label="加密方式">
            <el-select v-model="apConfig.encryption" style="width: 360px">
              <el-option label="OPEN" value="OPEN" />
              <el-option label="WEP-OPEN" value="WEP-OPEN" />
              <el-option label="WEP-SHARED" value="WEP-SHARED" />
              <el-option label="WPA2_PSK" value="WPA2_PSK" />
              <el-option label="WPA_WPA2_PSK" value="WPA_WPA2_PSK" />
              <el-option label="WPA3-SAE" value="WPA3-SAE" />
              <el-option label="WPA2_PSK_WPA3-SAE" value="WPA2_PSK_WPA3-SAE" />
            </el-select>
          </el-form-item>
          <el-form-item label="密码"><el-input v-model="apConfig.password" style="width: 360px" type="password" /></el-form-item>
          <el-form-item label="信道"><el-input-number v-model="apConfig.channel" :min="0" :max="14" /><span class="inline-unit">（范围 1～14 或 0 表示不指定）</span></el-form-item>
          <el-form-item><el-button type="primary" @click="save">保存</el-button></el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>SOCKET</span></template>
        <el-form label-width="140px">
          <el-form-item label="网络协议"><el-select v-model="apSocket.protocol" style="width: 360px"><el-option label="TCPC" value="TCPC" /><el-option label="TCPS" value="TCPS" /><el-option label="UDP" value="UDP" /></el-select></el-form-item>
          <el-form-item label="服务器地址"><el-input v-model="apSocket.serverAddr" style="width: 360px" /></el-form-item>
          <el-form-item label="端口"><el-input-number v-model="apSocket.port" :min="1" :max="65535" /></el-form-item>
          <el-form-item label="网络心跳包"><el-switch v-model="apSocket.heartbeatEnabled" /></el-form-item>
          <template v-if="apSocket.heartbeatEnabled"><el-form-item label="心跳间隔"><el-input-number v-model="apSocket.heartbeatInterval" :min="1" :max="3600" /><span class="inline-unit">秒</span></el-form-item></template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>客户端接入限制</span></template>
        <el-form label-width="140px">
          <el-form-item label="开关"><el-switch v-model="apLimit.enabled" /></el-form-item>
          <template v-if="apLimit.enabled">
            <el-form-item label="白名单"><el-input v-model="apLimit.whitelist" type="textarea" :rows="3" placeholder="输入白名单MAC列表，逗号分隔" /></el-form-item>
            <el-form-item label="黑名单"><el-input v-model="apLimit.blacklist" type="textarea" :rows="3" placeholder="输入黑名单MAC列表，逗号分隔" /></el-form-item>
          </template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>接入的客户端信息</span></template>
        <div v-for="(client, index) in apClients" :key="client.id" class="client-block">
          <div class="client-title">客户端{{ index + 1 }}</div>
          <el-form label-width="120px" class="client-form">
            <el-form-item label="WiFi名称"><el-input v-model="client.name" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="MAC地址"><el-input v-model="client.mac" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="IPv4-地址"><el-input v-model="client.ipv4" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="信号强度"><el-input v-model="client.rssi" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="接收速率"><el-input v-model="client.rxRate" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="发送速率"><el-input v-model="client.txRate" style="width: 260px" disabled /></el-form-item>
          </el-form>
          <el-divider v-if="index < apClients.length - 1" />
        </div>
      </el-card>
    </template>
    <template v-if="isClientMode">
      <el-card class="card" shadow="never">
        <template #header><span>客户端参数设置</span></template>
        <el-form label-width="140px">
          <el-form-item label="WiFi热点名称"><div style="display: flex; gap: 8px; align-items: center;"><el-input v-model="staConfig.ssid" style="width: 260px" /><el-button type="primary" @click="openScanDialog('sta')">扫描热点</el-button></div></el-form-item>
          <el-form-item label="绑定热点MAC"><el-switch v-model="staConfig.bindMacEnabled" /></el-form-item>
          <template v-if="staConfig.bindMacEnabled"><el-form-item label="热点MAC"><el-input v-model="staConfig.bindMac" style="width: 360px" placeholder="例如: AA:BB:CC:DD:EE:FF" /></el-form-item></template>
          <el-form-item label="加密方式"><el-select v-model="staConfig.encryption" style="width: 360px"><el-option label="不加密" value="none" /><el-option label="mixed-psk" value="mixed-psk" /></el-select></el-form-item>
          <el-form-item label="密码"><el-input v-model="staConfig.password" style="width: 360px" type="password" /></el-form-item>
          <el-form-item><el-button type="primary" @click="save">保存</el-button></el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>连接的热点信息</span></template>
        <el-form label-width="140px">
          <el-form-item label="WiFi名称"><el-input v-model="staHostInfo.name" style="width: 360px" disabled /></el-form-item>
          <el-form-item label="MAC地址"><el-input v-model="staHostInfo.mac" style="width: 360px" disabled /></el-form-item>
          <el-form-item label="信号强度"><el-input v-model="staHostInfo.rssi" style="width: 260px" disabled /></el-form-item>
          <el-form-item label="接收速率"><el-input v-model="staHostInfo.rxRate" style="width: 260px" disabled /></el-form-item>
          <el-form-item label="发送速率"><el-input v-model="staHostInfo.txRate" style="width: 260px" disabled /></el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>SOCKET</span></template>
        <el-form label-width="140px">
          <el-form-item label="网络协议"><el-select v-model="staSocket.protocol" style="width: 360px"><el-option label="TCPS" value="TCPS" /><el-option label="TCPC" value="TCPC" /><el-option label="UDP" value="UDP" /></el-select></el-form-item>
          <el-form-item label="端口"><el-input-number v-model="staSocket.port" :min="1" :max="65535" /></el-form-item>
          <el-form-item label="服务器地址"><el-input v-model="staSocket.serverAddr" style="width: 360px" /></el-form-item>
          <el-form-item label="网络心跳包"><el-switch v-model="staSocket.heartbeatEnabled" /></el-form-item>
          <template v-if="staSocket.heartbeatEnabled"><el-form-item label="心跳间隔"><el-input-number v-model="staSocket.heartbeatInterval" :min="1" :max="3600" /><span class="inline-unit">秒</span></el-form-item></template>
        </el-form>
      </el-card>
    </template>
    <template v-if="isBothMode">
      <el-card class="card" shadow="never">
        <template #header><span>客户端参数设置</span></template>
        <el-form label-width="140px">
          <el-form-item label="WiFi热点名称"><div style="display: flex; gap: 8px; align-items: center;"><el-input v-model="bothStaConfig.ssid" style="width: 260px" /><el-button type="primary" @click="openScanDialog('both')">扫描热点</el-button></div></el-form-item>
          <el-form-item label="绑定热点MAC"><el-switch v-model="bothStaConfig.bindMacEnabled" /></el-form-item>
          <template v-if="bothStaConfig.bindMacEnabled"><el-form-item label="热点MAC"><el-input v-model="bothStaConfig.bindMac" style="width: 360px" placeholder="例如: AA:BB:CC:DD:EE:FF" /></el-form-item></template>
          <el-form-item label="加密方式"><el-select v-model="bothStaConfig.encryption" style="width: 360px"><el-option label="不加密" value="none" /><el-option label="mixed-psk" value="mixed-psk" /></el-select></el-form-item>
          <el-form-item label="密码"><el-input v-model="bothStaConfig.password" style="width: 360px" type="password" /></el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>连接的热点信息</span></template>
        <el-form label-width="140px">
          <el-form-item label="WiFi名称"><el-input v-model="bothHostInfo.name" style="width: 360px" disabled /></el-form-item>
          <el-form-item label="MAC地址"><el-input v-model="bothHostInfo.mac" style="width: 360px" disabled /></el-form-item>
          <el-form-item label="信号强度"><el-input v-model="bothHostInfo.rssi" style="width: 260px" disabled /></el-form-item>
          <el-form-item label="接收速率"><el-input v-model="bothHostInfo.rxRate" style="width: 260px" disabled /></el-form-item>
          <el-form-item label="发送速率"><el-input v-model="bothHostInfo.txRate" style="width: 260px" disabled /></el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>SOCKET</span></template>
        <el-form label-width="140px">
          <el-form-item label="网络协议"><el-select v-model="bothStaSocket.protocol" style="width: 360px"><el-option label="TCPS" value="TCPS" /><el-option label="TCPC" value="TCPC" /><el-option label="UDP" value="UDP" /></el-select></el-form-item>
          <el-form-item label="端口"><el-input-number v-model="bothStaSocket.port" :min="1" :max="65535" /></el-form-item>
          <el-form-item label="服务器地址"><el-input v-model="bothStaSocket.serverAddr" style="width: 360px" /></el-form-item>
          <el-form-item label="网络心跳包"><el-switch v-model="bothStaSocket.heartbeatEnabled" /></el-form-item>
          <template v-if="bothStaSocket.heartbeatEnabled"><el-form-item label="心跳间隔"><el-input-number v-model="bothStaSocket.heartbeatInterval" :min="1" :max="3600" /><span class="inline-unit">秒</span></el-form-item></template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>扩展热点配置 - 热点参数设置</span></template>
        <el-form label-width="140px">
          <el-form-item label="WiFi名称"><el-input v-model="bothApConfig.name" style="width: 360px" /></el-form-item>
          <el-form-item label="WiFi名称隐藏"><el-switch v-model="bothApConfig.hidden" /></el-form-item>
          <el-form-item label="MAC地址"><el-input v-model="bothApConfig.mac" style="width: 360px" disabled /></el-form-item>
          <el-form-item label="加密方式"><el-select v-model="bothApConfig.encryption" style="width: 360px"><el-option label="OPEN" value="OPEN" /><el-option label="WEP-OPEN" value="WEP-OPEN" /><el-option label="WEP-SHARED" value="WEP-SHARED" /><el-option label="WPA2_PSK" value="WPA2_PSK" /><el-option label="WPA_WPA2_PSK" value="WPA_WPA2_PSK" /><el-option label="WPA3-SAE" value="WPA3-SAE" /><el-option label="WPA2_PSK_WPA3-SAE" value="WPA2_PSK_WPA3-SAE" /></el-select></el-form-item>
          <el-form-item label="密码"><el-input v-model="bothApConfig.password" style="width: 360px" type="password" /></el-form-item>
          <el-form-item label="信道"><el-input-number v-model="bothApConfig.channel" :min="0" :max="14" /><span class="inline-unit">（范围 1～14 或 0 表示不指定）</span></el-form-item>
          <el-form-item><el-button type="primary" @click="save">保存</el-button></el-form-item>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>扩展热点配置 - SOCKET</span></template>
        <el-form label-width="140px">
          <el-form-item label="网络协议"><el-select v-model="bothApSocket.protocol" style="width: 360px"><el-option label="TCPC" value="TCPC" /><el-option label="TCPS" value="TCPS" /><el-option label="UDP" value="UDP" /></el-select></el-form-item>
          <el-form-item label="服务器地址"><el-input v-model="bothApSocket.serverAddr" style="width: 360px" /></el-form-item>
          <el-form-item label="端口"><el-input-number v-model="bothApSocket.port" :min="1" :max="65535" /></el-form-item>
          <el-form-item label="网络心跳包"><el-switch v-model="bothApSocket.heartbeatEnabled" /></el-form-item>
          <template v-if="bothApSocket.heartbeatEnabled"><el-form-item label="心跳间隔"><el-input-number v-model="bothApSocket.heartbeatInterval" :min="1" :max="3600" /><span class="inline-unit">秒</span></el-form-item></template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>扩展热点配置 - 客户端接入限制</span></template>
        <el-form label-width="140px">
          <el-form-item label="开关"><el-switch v-model="bothApLimit.enabled" /></el-form-item>
          <template v-if="bothApLimit.enabled">
            <el-form-item label="白名单"><el-input v-model="bothApLimit.whitelist" type="textarea" :rows="3" placeholder="输入白名单MAC列表，逗号分隔" /></el-form-item>
            <el-form-item label="黑名单"><el-input v-model="bothApLimit.blacklist" type="textarea" :rows="3" placeholder="输入黑名单MAC列表，逗号分隔" /></el-form-item>
          </template>
        </el-form>
      </el-card>
      <el-card class="card" shadow="never">
        <template #header><span>扩展热点配置 - 接入的客户端信息</span></template>
        <div v-for="(client, index) in bothApClients" :key="client.id" class="client-block">
          <div class="client-title">客户端{{ index + 1 }}</div>
          <el-form label-width="120px" class="client-form">
            <el-form-item label="WiFi名称"><el-input v-model="client.name" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="MAC地址"><el-input v-model="client.mac" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="IPv4-地址"><el-input v-model="client.ipv4" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="信号强度"><el-input v-model="client.rssi" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="接收速率"><el-input v-model="client.rxRate" style="width: 260px" disabled /></el-form-item>
            <el-form-item label="发送速率"><el-input v-model="client.txRate" style="width: 260px" disabled /></el-form-item>
          </el-form>
          <el-divider v-if="index < bothApClients.length - 1" />
        </div>
      </el-card>
    </template>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import { useWirelessStore } from '../../stores/wireless';
const wirelessStore = useWirelessStore();
const workMode = computed(() => wirelessStore.workMode || 'host');
const workModeLabel = computed(() => workMode.value === 'client' ? '从机模式' : workMode.value === 'both' ? '主从机模式' : '主机模式');
const isHostMode = computed(() => workMode.value === 'host');
const isClientMode = computed(() => workMode.value === 'client');
const isBothMode = computed(() => workMode.value === 'both');
const scanDialogVisible = ref(false);
const currentScanMode = ref('sta');
const scannedAPs = ref([]);
const selectedAP = ref(null);
const apConfig = reactive({ name: '', hidden: false, mac: '', encryption: 'WPA2_PSK', password: '', channel: 6 });
const apClients = reactive(Array.from({ length: 8 }).map((_, idx) => ({ id: idx + 1, name: '', mac: '', ipv4: '', rssi: '', rxRate: '', txRate: '' })));
const apLimit = reactive({ enabled: false, whitelist: '', blacklist: '' });
const apSocket = reactive({ protocol: 'TCPC', serverAddr: '', port: 8080, heartbeatEnabled: false, heartbeatInterval: 60 });
const staConfig = reactive({ ssid: '', bindMacEnabled: false, bindMac: '', encryption: 'mixed-psk', password: '' });
const staHostInfo = reactive({ name: '', mac: '', rssi: '', rxRate: '', txRate: '' });
const staSocket = reactive({ protocol: 'TCPC', serverAddr: '', port: 8080, heartbeatEnabled: false, heartbeatInterval: 60 });
const bothStaConfig = reactive({ ssid: '', bindMacEnabled: false, bindMac: '', encryption: 'mixed-psk', password: '' });
const bothHostInfo = reactive({ name: '', mac: '', rssi: '', rxRate: '', txRate: '' });
const bothStaSocket = reactive({ protocol: 'TCPC', serverAddr: '', port: 8080, heartbeatEnabled: false, heartbeatInterval: 60 });
const bothApConfig = reactive({ name: '', hidden: false, mac: '', encryption: 'WPA2_PSK', password: '', channel: 6 });
const bothApClients = reactive(Array.from({ length: 8 }).map((_, idx) => ({ id: idx + 1, name: '', mac: '', ipv4: '', rssi: '', rxRate: '', txRate: '' })));
const bothApLimit = reactive({ enabled: false, whitelist: '', blacklist: '' });
const bothApSocket = reactive({ protocol: 'TCPC', serverAddr: '', port: 8080, heartbeatEnabled: false, heartbeatInterval: 60 });
const openScanDialog = (mode) => {
  currentScanMode.value = mode;
  selectedAP.value = null;
  scannedAPs.value = [
    { id: 1, name: 'WiFi-Home', mac: 'AA:BB:CC:DD:EE:01', rssi: '-45dBm' },
    { id: 2, name: 'WiFi-Office', mac: 'AA:BB:CC:DD:EE:02', rssi: '-52dBm' },
    { id: 3, name: 'WiFi-Guest', mac: 'AA:BB:CC:DD:EE:03', rssi: '-60dBm' },
    { id: 4, name: 'WiFi-5G', mac: 'AA:BB:CC:DD:EE:04', rssi: '-48dBm' }
  ];
  scanDialogVisible.value = true;
};
const handleAPSelection = (row) => { selectedAP.value = row; };
const confirmAPSelection = () => {
  if (!selectedAP.value) { window.alert('请选择一个WiFi热点'); return; }
  if (currentScanMode.value === 'sta') staConfig.ssid = selectedAP.value.name;
  else if (currentScanMode.value === 'both') bothStaConfig.ssid = selectedAP.value.name;
  scanDialogVisible.value = false;
  window.alert(`已选择WiFi热点：${selectedAP.value.name}`);
};
const save = () => { window.alert('已保存WiFi配置（示例页面，待接入接口）'); };
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.mode-tip { margin-top: 12px; }
.client-block { padding: 8px 0; }
.client-title { font-weight: 600; margin-bottom: 4px; }
.client-form { margin-left: 8px; }
.inline-unit { margin-left: 8px; color: #909399; }
.scan-empty { text-align: center; padding: 40px 20px; color: #909399; }
</style>
