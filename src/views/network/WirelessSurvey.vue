<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">网络诊断</div>
      <div class="page-subtitle">执行简单的网络连通性检测（示例）。</div>
    </div>

    <el-card class="card" shadow="never">
      <el-form label-width="140px" @submit.prevent>
        <el-form-item label="诊断类型">
          <el-select v-model="form.type" style="width: 220px">
            <el-option label="Ping" value="ping" />
            <el-option label="Traceroute" value="traceroute" />
            <el-option label="DNS 查询" value="dns" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标地址">
          <el-input v-model="form.host" placeholder="例如: 8.8.8.8 或 example.com" style="width: 360px" />
        </el-form-item>
        <el-form-item v-if="form.type !== 'dns'" label="次数">
          <el-input-number v-model="form.count" :min="1" :max="20" />
        </el-form-item>
        <el-form-item v-if="form.type !== 'dns'" label="超时(秒)">
          <el-input-number v-model="form.timeout" :min="1" :max="30" />
        </el-form-item>
        <el-form-item v-if="form.type === 'ping'" label="包大小(Bytes)">
          <el-input-number v-model="form.packetSize" :min="16" :max="1500" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="run">开始检测</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />
      <el-empty v-if="!result" description="暂无结果" />
      <el-alert v-else :title="result" type="success" show-icon :closable="false" />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const defaults = {
  type: 'ping',
  host: '8.8.8.8',
  count: 4,
  timeout: 3,
  packetSize: 56
};

const form = reactive({ ...defaults });
const result = ref('');

const run = () => {
  const base = `已发起检测（示例）：${form.type.toUpperCase()} ${form.host}`;
  const extra =
    form.type === 'dns'
      ? ''
      : `, 次数=${form.count}, 超时=${form.timeout}s` + (form.type === 'ping' ? `, 包大小=${form.packetSize}B` : '');
  result.value = base + extra;
};

const reset = () => {
  Object.assign(form, defaults);
  result.value = '';
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

