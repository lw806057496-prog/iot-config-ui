<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">星闪网络</div>
      <div class="page-subtitle">
        根据无线模式下的工作模式（主机/从机/主从机）配置对应的星闪参数。
      </div>
    </div>

    <el-alert
      class="mode-tip"
      :title="`当前工作模式：${workModeLabel}`"
      type="info"
      show-icon
      :closable="false"
    />

    <!-- 扫描从机弹窗 -->
    <el-dialog v-model="scanDialogVisible" title="扫描从机设备" width="600px">
      <div v-if="scannedSlaves.length === 0" class="scan-empty">
        <p>未发现从机设备</p>
      </div>
      <el-table v-else :data="scannedSlaves" style="width: 100%" @selection-change="handleScanSelection">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="星闪名称" width="150" />
        <el-table-column prop="mac" label="MAC地址" width="180" />
        <el-table-column prop="rssi" label="信号强度" width="100" />
      </el-table>
      <template #footer>
        <el-button @click="scanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmScanSelection">确认</el-button>
      </template>
    </el-dialog>

    <!-- 星闪主机配置：工作模式 = 主机模式 -->
    <template v-if="isHostMode">
      <!-- 主机参数设置 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>主机参数设置</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="星闪名称">
            <el-input v-model="hostConfig.name" style="width: 360px" />
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input v-model="hostConfig.mac" style="width: 360px" disabled />
          </el-form-item>

          <el-divider>连接从机</el-divider>

          <el-form-item label="扫描从机">
            <el-button type="primary" @click="openScanDialog('host')">扫描从机</el-button>
          </el-form-item>

          <div class="mac-list">
            <div v-for="idx in 8" :key="`scan-${idx}`" class="mac-row">
              <span class="mac-label">从机MAC{{ idx }}</span>
              <el-input
                v-model="hostConfig.scanMacs[idx - 1]"
                style="width: 260px"
                placeholder="例如: AA:BB:CC:DD:EE:FF"
              />
              <el-checkbox v-model="hostConfig.scanSelected" :label="idx">多选</el-checkbox>
            </div>
          </div>

          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 主机接入限制 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>主机接入限制</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="开关">
            <el-switch v-model="hostLimit.enabled" />
          </el-form-item>
          <template v-if="hostLimit.enabled">
            <el-form-item label="白名单">
              <el-input
                v-model="hostLimit.whitelist"
                type="textarea"
                :rows="3"
                placeholder="输入白名单MAC列表，逗号分隔"
              />
            </el-form-item>
            <el-form-item label="黑名单">
              <el-input
                v-model="hostLimit.blacklist"
                type="textarea"
                :rows="3"
                placeholder="输入黑名单MAC列表，逗号分隔"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-card>

      <!-- 接入的从机信息 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>接入的从机信息</span>
        </template>
        <div v-for="(slave, index) in hostSlaves" :key="slave.id" class="slave-block">
          <div class="slave-title">从机{{ index + 1 }}</div>
          <el-form label-width="120px" class="slave-form">
            <el-form-item label="星闪名称">
              <el-input v-model="slave.name" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="MAC地址">
              <el-input v-model="slave.mac" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="信号强度">
              <el-input v-model="slave.rssi" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="接收速率">
              <el-input v-model="slave.rxRate" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="发送速率">
              <el-input v-model="slave.txRate" style="width: 260px" disabled />
            </el-form-item>
          </el-form>
          <el-divider v-if="index < hostSlaves.length - 1" />
        </div>
      </el-card>
    </template>

    <!-- 星闪从机配置：工作模式 = 从机模式 -->
    <template v-if="isClientMode">
      <!-- 从机参数设置 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>从机参数设置</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="星闪名称">
            <el-input v-model="clientConfig.name" style="width: 360px" />
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input v-model="clientConfig.mac" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item label="自动广播">
            <el-switch v-model="clientConfig.autoBroadcast" />
          </el-form-item>
          <template v-if="clientConfig.autoBroadcast">
            <el-form-item label="星闪广播间隔">
              <el-input-number v-model="clientConfig.broadcastInterval" :min="1" :max="3600" />
              <span class="inline-unit">秒</span>
            </el-form-item>
          </template>
        </el-form>
      </el-card>

      <!-- 连接的主机信息 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>连接的主机信息</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="星闪名称">
            <el-input v-model="clientHostInfo.name" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input v-model="clientHostInfo.mac" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item label="信号强度">
            <el-input v-model="clientHostInfo.rssi" style="width: 260px" disabled />
          </el-form-item>
          <el-form-item label="接收速率">
            <el-input v-model="clientHostInfo.rxRate" style="width: 260px" disabled />
          </el-form-item>
          <el-form-item label="发送速率">
            <el-input v-model="clientHostInfo.txRate" style="width: 260px" disabled />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 网络心跳包 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>网络心跳包</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="打开">
            <el-switch v-model="clientHeartbeat.enabled" />
          </el-form-item>
          <template v-if="clientHeartbeat.enabled">
            <el-form-item label="心跳间隔">
              <el-input-number v-model="clientHeartbeat.interval" :min="1" :max="3600" />
              <span class="inline-unit">秒</span>
            </el-form-item>
          </template>
        </el-form>
      </el-card>
    </template>

    <!-- 星闪主从机配置：工作模式 = 主从机模式 -->
    <template v-if="isBothMode">
      <!-- 从机参数设置 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>从机参数设置</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="星闪名称">
            <el-input v-model="bothClientConfig.name" style="width: 360px" />
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input v-model="bothClientConfig.mac" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item label="自动广播">
            <el-switch v-model="bothClientConfig.autoBroadcast" />
          </el-form-item>
          <template v-if="bothClientConfig.autoBroadcast">
            <el-form-item label="星闪广播间隔">
              <el-input-number v-model="bothClientConfig.broadcastInterval" :min="1" :max="3600" />
              <span class="inline-unit">秒</span>
            </el-form-item>
          </template>
        </el-form>
      </el-card>

      <!-- 连接的主机信息 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>连接的主机信息</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="星闪名称">
            <el-input v-model="bothHostInfo.name" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input v-model="bothHostInfo.mac" style="width: 360px" disabled />
          </el-form-item>
          <el-form-item label="信号强度">
            <el-input v-model="bothHostInfo.rssi" style="width: 260px" disabled />
          </el-form-item>
          <el-form-item label="接收速率">
            <el-input v-model="bothHostInfo.rxRate" style="width: 260px" disabled />
          </el-form-item>
          <el-form-item label="发送速率">
            <el-input v-model="bothHostInfo.txRate" style="width: 260px" disabled />
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 网络心跳包 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>网络心跳包</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="打开">
            <el-switch v-model="bothHeartbeat.enabled" />
          </el-form-item>
          <template v-if="bothHeartbeat.enabled">
            <el-form-item label="心跳间隔">
              <el-input-number v-model="bothHeartbeat.interval" :min="1" :max="3600" />
              <span class="inline-unit">秒</span>
            </el-form-item>
          </template>
        </el-form>
      </el-card>

      <!-- 扩展主机配置 - 主机参数设置 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>扩展主机配置 - 主机参数设置</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="星闪名称">
            <el-input v-model="bothHostConfig.name" style="width: 360px" />
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input v-model="bothHostConfig.mac" style="width: 360px" disabled />
          </el-form-item>

          <el-divider>连接从机</el-divider>

          <el-form-item label="扫描从机">
            <el-button type="primary" @click="openScanDialog('both')">扫描从机</el-button>
          </el-form-item>

          <div class="mac-list">
            <div v-for="idx in 8" :key="`bscan-${idx}`" class="mac-row">
              <span class="mac-label">从机MAC{{ idx }}</span>
              <el-input
                v-model="bothHostConfig.scanMacs[idx - 1]"
                style="width: 260px"
                placeholder="例如: AA:BB:CC:DD:EE:FF"
              />
              <el-checkbox v-model="bothHostConfig.scanSelected" :label="idx">多选</el-checkbox>
            </div>
          </div>

          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 扩展主机配置 - 主机接入限制 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>扩展主机配置 - 主机接入限制</span>
        </template>
        <el-form label-width="140px">
          <el-form-item label="开关">
            <el-switch v-model="bothLimit.enabled" />
          </el-form-item>
          <template v-if="bothLimit.enabled">
            <el-form-item label="白名单">
              <el-input
                v-model="bothLimit.whitelist"
                type="textarea"
                :rows="3"
                placeholder="输入白名单MAC列表，逗号分隔"
              />
            </el-form-item>
            <el-form-item label="黑名单">
              <el-input
                v-model="bothLimit.blacklist"
                type="textarea"
                :rows="3"
                placeholder="输入黑名单MAC列表，逗号分隔"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-card>

      <!-- 扩展主机配置 - 接入的从机信息 -->
      <el-card class="card" shadow="never">
        <template #header>
          <span>扩展主机配置 - 接入的从机信息</span>
        </template>
        <div v-for="(slave, index) in bothHostSlaves" :key="slave.id" class="slave-block">
          <div class="slave-title">从机{{ index + 1 }}</div>
          <el-form label-width="120px" class="slave-form">
            <el-form-item label="星闪名称">
              <el-input v-model="slave.name" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="MAC地址">
              <el-input v-model="slave.mac" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="信号强度">
              <el-input v-model="slave.rssi" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="接收速率">
              <el-input v-model="slave.rxRate" style="width: 260px" disabled />
            </el-form-item>
            <el-form-item label="发送速率">
              <el-input v-model="slave.txRate" style="width: 260px" disabled />
            </el-form-item>
          </el-form>
          <el-divider v-if="index < bothHostSlaves.length - 1" />
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
const workModeLabel = computed(() => {
  if (workMode.value === 'client') return '从机模式';
  if (workMode.value === 'both') return '主从机模式';
  return '主机模式';
});

const isHostMode = computed(() => workMode.value === 'host');
const isClientMode = computed(() => workMode.value === 'client');
const isBothMode = computed(() => workMode.value === 'both');

// 扫描弹窗状态
const scanDialogVisible = ref(false);
const currentScanMode = ref('host'); // 'host' 或 'both'
const scannedSlaves = ref([]);
const selectedScannedSlaves = ref([]);

const baseHostConfig = {
  name: '',
  mac: '',
  scanMacs: Array(8).fill(''),
  scanSelected: [],
  directMacs: Array(8).fill('')
};

const hostConfig = reactive({ ...baseHostConfig });
const hostSlaves = reactive(
  Array.from({ length: 8 }).map((_, idx) => ({
    id: idx + 1,
    name: '',
    mac: '',
    rssi: '',
    rxRate: '',
    txRate: ''
  }))
);

const hostLimit = reactive({
  enabled: false,
  whitelist: '',
  blacklist: ''
});

const clientConfig = reactive({
  name: '',
  mac: '',
  autoBroadcast: false,
  broadcastInterval: 60
});

const clientHostInfo = reactive({
  name: '',
  mac: '',
  rssi: '',
  rxRate: '',
  txRate: ''
});

const clientHeartbeat = reactive({
  enabled: false,
  interval: 60
});

const bothClientConfig = reactive({
  name: '',
  mac: '',
  autoBroadcast: false,
  broadcastInterval: 60
});

const bothHostInfo = reactive({
  name: '',
  mac: '',
  rssi: '',
  rxRate: '',
  txRate: ''
});

const bothHeartbeat = reactive({
  enabled: false,
  interval: 60
});

const bothHostConfig = reactive({
  name: '',
  mac: '',
  scanMacs: Array(8).fill(''),
  scanSelected: [],
  directMacs: Array(8).fill('')
});

const bothHostSlaves = reactive(
  Array.from({ length: 8 }).map((_, idx) => ({
    id: idx + 1,
    name: '',
    mac: '',
    rssi: '',
    rxRate: '',
    txRate: ''
  }))
);

const bothLimit = reactive({
  enabled: false,
  whitelist: '',
  blacklist: ''
});

const save = () => {
  window.alert('已保存星闪配置（示例页面，待接入接口）');
};

const openScanDialog = (mode) => {
  currentScanMode.value = mode;
  selectedScannedSlaves.value = [];
  // 模拟扫描结果（实际应调用接口）
  scannedSlaves.value = [
    { id: 1, name: '从机设备1', mac: 'AA:BB:CC:DD:EE:01', rssi: '-45dBm' },
    { id: 2, name: '从机设备2', mac: 'AA:BB:CC:DD:EE:02', rssi: '-52dBm' },
    { id: 3, name: '从机设备3', mac: 'AA:BB:CC:DD:EE:03', rssi: '-60dBm' },
    { id: 4, name: '从机设备4', mac: 'AA:BB:CC:DD:EE:04', rssi: '-48dBm' }
  ];
  scanDialogVisible.value = true;
};

const handleScanSelection = (selection) => {
  selectedScannedSlaves.value = selection;
};

const confirmScanSelection = () => {
  if (selectedScannedSlaves.value.length === 0) {
    window.alert('请至少选择一个从机设备');
    return;
  }

  const targetConfig = currentScanMode.value === 'host' ? hostConfig : bothHostConfig;
  
  // 将选中的从机 MAC 填入对应的输入框
  selectedScannedSlaves.value.forEach((slave, index) => {
    if (index < 8) {
      targetConfig.scanMacs[index] = slave.mac;
    }
  });

  scanDialogVisible.value = false;
  window.alert(`已填入 ${selectedScannedSlaves.value.length} 个从机MAC地址`);
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

.mode-tip {
  margin-top: 12px;
}

.mac-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mac-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mac-label {
  width: 100px;
  color: #606266;
}

.mac-extra {
  font-size: 12px;
  color: #909399;
}

.slave-block {
  padding: 8px 0;
}

.slave-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.slave-form {
  margin-left: 8px;
}

.inline-unit {
  margin-left: 8px;
  color: #909399;
}

.scan-empty {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}
</style>

