<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">网络诊断</div>
      <div class="page-subtitle">无线环境勘察和网络连通性检测。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>无线环境勘察</span>
          <el-button type="primary" :loading="scanning" @click="startScan">{{ scanning ? '自动刷新中...' : '刷新频谱' }}</el-button>
        </div>
      </template>
      <el-alert title="应用方式：用于现场2.4G环境的监测，分为WiFi周围信号扫描和星闪周围信号扫描" type="info" :closable="false" style="margin-bottom: 16px" />
      <el-tabs v-model="activeTab">
        <el-tab-pane label="2.4GHz" name="wifi">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">信道分析</div>
              <div class="chart-legend">
                <span class="legend-item" v-for="ap in wifiAPs.slice(0, 5)" :key="ap.bssid">
                  <span class="legend-dot" :style="{ backgroundColor: ap.color }"></span>{{ ap.ssid }}
                </span>
              </div>
            </div>
            <div class="chart-area">
              <div class="y-axis">
                <div class="y-label">-20 dBm</div>
                <div class="y-label">-40 dBm</div>
                <div class="y-label">-60 dBm</div>
                <div class="y-label">-80 dBm</div>
                <div class="y-label">-100 dBm</div>
              </div>
              <div class="chart-content">
                <div class="x-axis"><div class="x-label" v-for="ch in 13" :key="ch">{{ ch }}</div></div>
                <svg class="signal-chart" viewBox="0 0 1300 400">
                  <g v-for="(ap, index) in wifiAPs" :key="ap.bssid">
                    <path :d="generateSignalPath(ap)" :fill="ap.color" :opacity="0.6" />
                    <text :x="ap.channel * 100 - 50" :y="signalToY(ap.signal) - 10" :fill="ap.color" font-size="12" text-anchor="middle">{{ ap.ssid }}</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <el-table :data="wifiAPs" style="width: 100%; margin-top: 20px">
            <el-table-column label="信号" width="100"><template #default="{ row }"><span :style="{ color: getSignalColor(row.signal) }">{{ row.signal }} dBm</span></template></el-table-column>
            <el-table-column prop="ssid" label="SSID" width="200" />
            <el-table-column prop="channel" label="信道" width="80" />
            <el-table-column prop="bandwidth" label="频宽" width="100" />
            <el-table-column prop="mode" label="模式" width="100" />
            <el-table-column prop="bssid" label="BSSID" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="星闪" name="sle">
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">信道分析</div>
              <div class="chart-legend">
                <span class="legend-item" v-for="gw in sleGateways.slice(0, 5)" :key="gw.mac">
                  <span class="legend-dot" :style="{ backgroundColor: gw.color }"></span>{{ gw.name }}
                </span>
              </div>
            </div>
            <div class="chart-area">
              <div class="y-axis">
                <div class="y-label">-20 dBm</div>
                <div class="y-label">-40 dBm</div>
                <div class="y-label">-60 dBm</div>
                <div class="y-label">-80 dBm</div>
                <div class="y-label">-100 dBm</div>
              </div>
              <div class="chart-content">
                <div class="x-axis"><div class="x-label" v-for="ch in 13" :key="ch">{{ ch }}</div></div>
                <svg class="signal-chart" viewBox="0 0 1300 400">
                  <g v-for="(gw, index) in sleGateways" :key="gw.mac">
                    <path :d="generateSignalPath(gw)" :fill="gw.color" :opacity="0.6" />
                    <text :x="gw.channel * 100 - 50" :y="signalToY(gw.signal) - 10" :fill="gw.color" font-size="12" text-anchor="middle">{{ gw.name }}</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <el-table :data="sleGateways" style="width: 100%; margin-top: 20px">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="name" label="名称" width="200" />
            <el-table-column prop="channel" label="信道" width="100" />
            <el-table-column label="信号" width="120"><template #default="{ row }"><span :style="{ color: getSignalColor(row.signal) }">{{ row.signal }} dBm</span></template></el-table-column>
            <el-table-column prop="mac" label="MAC" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="card" shadow="never">
      <template #header><span>Ping 测试</span></template>
      <el-tabs v-model="pingTab">
        <el-tab-pane label="Ping" name="ping">
          <el-form label-width="120px">
            <el-form-item label="目标地址"><el-input v-model="pingForm.host" placeholder="例如: 8.8.8.8 或 www.baidu.com" style="width: 360px" /></el-form-item>
            <el-form-item label="次数"><el-input-number v-model="pingForm.count" :min="1" :max="100" /></el-form-item>
            <el-form-item label="超时(秒)"><el-input-number v-model="pingForm.timeout" :min="1" :max="30" /></el-form-item>
            <el-form-item label="包大小(Bytes)"><el-input-number v-model="pingForm.packetSize" :min="16" :max="1500" /></el-form-item>
            <el-form-item><el-button type="primary" @click="runPing">开始 Ping</el-button><el-button @click="clearPingResult">清除结果</el-button></el-form-item>
          </el-form>
          <el-divider />
          <div v-if="pingResult" class="result-box"><pre>{{ pingResult }}</pre></div>
          <el-empty v-else description="暂无结果" />
        </el-tab-pane>
        <el-tab-pane label="Traceroute" name="traceroute">
          <el-form label-width="120px">
            <el-form-item label="目标地址"><el-input v-model="tracerouteForm.host" placeholder="例如: www.baidu.com" style="width: 360px" /></el-form-item>
            <el-form-item label="最大跳数"><el-input-number v-model="tracerouteForm.maxHops" :min="1" :max="64" /></el-form-item>
            <el-form-item><el-button type="primary" @click="runTraceroute">开始 Traceroute</el-button><el-button @click="clearTracerouteResult">清除结果</el-button></el-form-item>
          </el-form>
          <el-divider />
          <div v-if="tracerouteResult" class="result-box"><pre>{{ tracerouteResult }}</pre></div>
          <el-empty v-else description="暂无结果" />
        </el-tab-pane>
        <el-tab-pane label="Nslookup" name="nslookup">
          <el-form label-width="120px">
            <el-form-item label="域名"><el-input v-model="nslookupForm.domain" placeholder="例如: www.baidu.com" style="width: 360px" /></el-form-item>
            <el-form-item label="DNS服务器"><el-input v-model="nslookupForm.dnsServer" placeholder="留空使用默认DNS" style="width: 360px" /></el-form-item>
            <el-form-item><el-button type="primary" @click="runNslookup">开始查询</el-button><el-button @click="clearNslookupResult">清除结果</el-button></el-form-item>
          </el-form>
          <el-divider />
          <div v-if="nslookupResult" class="result-box"><pre>{{ nslookupResult }}</pre></div>
          <el-empty v-else description="暂无结果" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
const activeTab = ref('wifi');
const pingTab = ref('ping');
const scanning = ref(false);
const wifiAPs = ref([
  { ssid: 'AP520X-C-1114', channel: 1, bandwidth: '20 MHz', signal: -22, mode: 'Master', bssid: 'c4:4b:d1:00:11:16', color: '#4CAF50' },
  { ssid: '产品部2', channel: 11, bandwidth: '40 MHz', signal: -34, mode: 'Master', bssid: 'd4:ad:20:4a:58:e2', color: '#2196F3' },
  { ssid: 'yunji_SC_01561', channel: 11, bandwidth: '20 MHz', signal: -36, mode: 'Master', bssid: 'd6:ad:20:8b:78:cd', color: '#9C27B0' },
  { ssid: 'USR-AP', channel: 11, bandwidth: '20 MHz', signal: -38, mode: 'Master', bssid: 'd4:ad:20:bc:d5:97', color: '#FF9800' },
  { ssid: 'QianTai', channel: 3, bandwidth: '20 MHz', signal: -43, mode: 'Master', bssid: '3c:cd:57:e1:df:47', color: '#F44336' },
  { ssid: '产品部', channel: 2, bandwidth: '40 MHz', signal: -44, mode: 'Master', bssid: 'f4:84:8d:c2:f3:c1', color: '#00BCD4' },
  { ssid: '', channel: 11, bandwidth: '20 MHz', signal: -45, mode: 'Master', bssid: 'd4:ad:20:8b:78:cd', color: '#607D8B' }
]);
const sleGateways = ref([
  { name: 'SLE-Gateway-01', channel: 2, signal: -35, mac: 'AA:BB:CC:DD:EE:01', color: '#4CAF50' },
  { name: 'SLE-Gateway-02', channel: 6, signal: -42, mac: 'AA:BB:CC:DD:EE:02', color: '#2196F3' },
  { name: 'SLE-Gateway-03', channel: 11, signal: -48, mac: 'AA:BB:CC:DD:EE:03', color: '#9C27B0' }
]);
const pingForm = reactive({ host: '8.8.8.8', count: 4, timeout: 3, packetSize: 56 });
const pingResult = ref('');
const tracerouteForm = reactive({ host: 'www.baidu.com', maxHops: 30 });
const tracerouteResult = ref('');
const nslookupForm = reactive({ domain: 'www.baidu.com', dnsServer: '' });
const nslookupResult = ref('');
const startScan = () => {
  scanning.value = true;
  setTimeout(() => { scanning.value = false; window.alert('扫描完成（示例数据）'); }, 2000);
};
const generateSignalPath = (device) => {
  const channel = device.channel;
  const signal = device.signal;
  const centerX = channel * 100 - 50;
  const centerY = signalToY(signal);
  const bandwidth = device.bandwidth === '40 MHz' ? 200 : 100;
  const points = [];
  for (let i = -bandwidth; i <= bandwidth; i += 10) {
    const x = centerX + i;
    const strength = Math.exp(-(i * i) / (bandwidth * bandwidth / 4));
    const y = 400 - (400 - centerY) * strength;
    points.push(`${x},${y}`);
  }
  return `M ${centerX - bandwidth},400 L ${points.join(' L ')} L ${centerX + bandwidth},400 Z`;
};
const signalToY = (signal) => ((signal + 20) / -80) * 400;
const getSignalColor = (signal) => {
  if (signal >= -50) return '#67C23A';
  if (signal >= -70) return '#E6A23C';
  return '#F56C6C';
};
const runPing = () => {
  pingResult.value = `正在 Ping ${pingForm.host} [${pingForm.host}] 具有 ${pingForm.packetSize} 字节的数据:\n\n`;
  pingResult.value += `来自 ${pingForm.host} 的回复: 字节=${pingForm.packetSize} 时间=15ms TTL=56\n`;
  pingResult.value += `来自 ${pingForm.host} 的回复: 字节=${pingForm.packetSize} 时间=12ms TTL=56\n`;
  pingResult.value += `来自 ${pingForm.host} 的回复: 字节=${pingForm.packetSize} 时间=18ms TTL=56\n`;
  pingResult.value += `来自 ${pingForm.host} 的回复: 字节=${pingForm.packetSize} 时间=14ms TTL=56\n\n`;
  pingResult.value += `${pingForm.host} 的 Ping 统计信息:\n    数据包: 已发送 = ${pingForm.count}，已接收 = ${pingForm.count}，丢失 = 0 (0% 丢失)，\n`;
  pingResult.value += `往返行程的估计时间(以毫秒为单位):\n    最短 = 12ms，最长 = 18ms，平均 = 14ms\n\n（示例数据，待接入实际接口）`;
};
const clearPingResult = () => { pingResult.value = ''; };
const runTraceroute = () => {
  tracerouteResult.value = `通过最多 ${tracerouteForm.maxHops} 个跃点跟踪到 ${tracerouteForm.host} 的路由\n\n`;
  tracerouteResult.value += `  1    <1 ms    <1 ms    <1 ms  192.168.1.1\n  2     5 ms     4 ms     5 ms  10.0.0.1\n`;
  tracerouteResult.value += `  3    12 ms    11 ms    13 ms  61.144.56.1\n  4    15 ms    14 ms    16 ms  ${tracerouteForm.host} [220.181.38.148]\n\n`;
  tracerouteResult.value += `跟踪完成。\n\n（示例数据，待接入实际接口）`;
};
const clearTracerouteResult = () => { tracerouteResult.value = ''; };
const runNslookup = () => {
  const dns = nslookupForm.dnsServer || '8.8.8.8';
  nslookupResult.value = `服务器:  ${dns}\nAddress:  ${dns}\n\n非权威应答:\n名称:    ${nslookupForm.domain}\n`;
  nslookupResult.value += `Addresses:  220.181.38.148\n            220.181.38.149\n\n（示例数据，待接入实际接口）`;
};
const clearNslookupResult = () => { nslookupResult.value = ''; };
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
.chart-container { border: 1px solid #EBEEF5; border-radius: 4px; padding: 16px; background: #fff; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.chart-title { font-size: 14px; font-weight: 600; color: #303133; }
.chart-legend { display: flex; gap: 16px; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #606266; }
.legend-dot { width: 12px; height: 12px; border-radius: 50%; }
.chart-area { display: flex; gap: 8px; }
.y-axis { display: flex; flex-direction: column; justify-content: space-between; width: 60px; height: 400px; }
.y-label { font-size: 12px; color: #909399; text-align: right; }
.chart-content { flex: 1; position: relative; }
.x-axis { display: flex; justify-content: space-around; margin-top: 8px; }
.x-label { font-size: 12px; color: #909399; text-align: center; width: 100px; }
.signal-chart { width: 100%; height: 400px; border: 1px solid #EBEEF5; border-radius: 4px; background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%); }
.result-box { background: #f5f7fa; border: 1px solid #EBEEF5; border-radius: 4px; padding: 16px; max-height: 400px; overflow-y: auto; }
.result-box pre { margin: 0; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #303133; white-space: pre-wrap; word-wrap: break-word; }
</style>
