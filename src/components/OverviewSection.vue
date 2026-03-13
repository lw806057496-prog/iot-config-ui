<template>
  <div>
    <div class="content-header">
      <h2>概览</h2>
      <p>设备状态总览</p>
    </div>

    <!-- 上方：系统信息 + 性能 -->
    <div class="grid">
      <div class="card">
        <div class="card-header">系统信息</div>
        <div class="form-item">
          <div class="form-label">产品型号:</div>
          <span>USR-NL200</span>
        </div>
        <div class="form-item">
          <div class="form-label">SN码:</div>
          <span>NL2024000001</span>
        </div>
        <div class="form-item">
          <div class="form-label">MAC:</div>
          <span>00:11:22:33:44:55</span>
        </div>
        <div class="form-item">
          <div class="form-label">固件版本:</div>
          <span>V1.0.0</span>
        </div>
        <div class="form-item">
          <div class="form-label">操作系统:</div>
          <span>Linux 5.4.0</span>
        </div>
        <div class="form-item">
          <div class="form-label">设备时间:</div>
          <span>2026-03-10 12:00:00</span>
        </div>
        <div class="form-item">
          <div class="form-label">运行时间:</div>
          <span>7天 12小时 30分钟</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">设备性能</div>
        <div class="form-item">
          <div class="form-label">CPU使用率:</div>
          <div class="meter">
            <span>25%</span>
            <div class="bar">
              <div class="inner cpu"></div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-label">内存使用率:</div>
          <div class="meter">
            <span>40%</span>
            <div class="bar">
              <div class="inner mem"></div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-label">Flash使用率:</div>
          <div class="meter">
            <span>30%</span>
            <div class="bar">
              <div class="inner flash"></div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="form-label">存储使用率:</div>
          <div class="meter">
            <span>20%</span>
            <div class="bar">
              <div class="inner disk"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间：无线网络信息 + 网口信息 -->
    <div class="grid mt-20">
      <div class="card">
        <div class="card-header">无线网络信息</div>
        <div class="form-item">
          <div class="form-label">无线模式:</div>
          <span>SLE</span>
        </div>
        <div class="form-item">
          <div class="form-label">工作模式:</div>
          <span>主机模式</span>
        </div>
        <div class="form-item">
          <div class="form-label">网络状态:</div>
          <span class="status-tag status-online">已连接</span>
        </div>
        <div class="form-item">
          <div class="form-label">无线名称:</div>
          <span>USR-NL200_Star</span>
        </div>
        <div class="form-item">
          <div class="form-label">星闪MAC:</div>
          <span>AA:BB:CC:DD:EE:FF</span>
        </div>
        <div class="form-item">
          <div class="form-label">信号强度:</div>
          <span>-60 dBm</span>
        </div>
        <div class="form-item">
          <div class="form-label">接收速率:</div>
          <span>100 Mbps</span>
        </div>
        <div class="form-item">
          <div class="form-label">发送速率:</div>
          <span>100 Mbps</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">网口信息</div>
        <div class="form-item">
          <div class="form-label">网口模式:</div>
          <span>LAN</span>
        </div>
        <div class="form-item">
          <div class="form-label">网络模式:</div>
          <span>静态IP</span>
        </div>
        <div class="form-item">
          <div class="form-label">网口MAC:</div>
          <span>11:22:33:44:55:66</span>
        </div>
        <div class="form-item">
          <div class="form-label">IP地址:</div>
          <span>192.168.10.1</span>
        </div>
        <div class="form-item">
          <div class="form-label">子网掩码:</div>
          <span>255.255.255.0</span>
        </div>
        <div class="form-item">
          <div class="form-label">网关地址:</div>
          <span>192.168.10.254</span>
        </div>
      </div>
    </div>

    <!-- 下方：组网拓扑 -->
    <div class="card mt-20">
      <div class="card-header">组网拓扑</div>
      <div class="topology-wrapper">
        <!-- 主机 -->
        <div class="host">
          <div class="device-info host-info">
            <div class="device-name">本机</div>
            <div class="device-text">模式: 主机</div>
            <div class="device-text">MAC: AA:BB:CC:DD:EE:FF</div>
          </div>
          <div class="device-card host-card">
            <div class="device-inner host-inner">
              <div>USR</div>
              <div>NL200</div>
            </div>
          </div>
        </div>

        <!-- 从机列表 -->
        <div class="slave slave-1">
          <div class="device-card slave-card">
            <div class="device-inner slave-inner">
              <div>USR</div>
              <div>NL200</div>
            </div>
          </div>
          <div class="device-info right">
            <div class="device-name">从机1</div>
            <div class="device-text">模式: 从机</div>
            <div class="device-text">MAC: 11:22:33:44:55:66</div>
          </div>
        </div>

        <div class="slave slave-2">
          <div class="device-card slave-card">
            <div class="device-inner slave-inner">
              <div>USR</div>
              <div>NL200</div>
            </div>
          </div>
          <div class="device-info right">
            <div class="device-name">从机2</div>
            <div class="device-text">模式: 从机</div>
            <div class="device-text">MAC: 22:33:44:55:66:77</div>
          </div>
        </div>

        <div class="slave slave-3">
          <div class="device-card slave-card">
            <div class="device-inner slave-inner">
              <div>USR</div>
              <div>NL200</div>
            </div>
          </div>
          <div class="device-info right">
            <div class="device-name">从机3</div>
            <div class="device-text">模式: 从机</div>
            <div class="device-text">MAC: 33:44:55:66:77:88</div>
          </div>
        </div>

        <div class="slave slave-4">
          <div class="device-card slave-card">
            <div class="device-inner slave-inner">
              <div>USR</div>
              <div>NL200</div>
            </div>
          </div>
          <div class="device-info right">
            <div class="device-name">从机4</div>
            <div class="device-text">模式: 从机</div>
            <div class="device-text">MAC: 44:55:66:77:88:99</div>
          </div>
        </div>

        <!-- 连线：使用平滑曲线连接主机和从机（上一步版本） -->
        <svg class="topology-lines" viewBox="0 0 1000 550" preserveAspectRatio="none">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#409eff" />
            </marker>
          </defs>

          <!-- 到从机1 -->
          <path
            d="M 180 275 C 380 180, 620 120, 820 80"
            stroke="#409eff"
            stroke-width="2"
            stroke-dasharray="5,5"
            fill="none"
            marker-end="url(#arrow)"
          />
          <text x="500" y="140" class="line-text">SLE (已连接)</text>

          <!-- 到从机2 -->
          <path
            d="M 180 275 C 380 230, 620 210, 820 190"
            stroke="#409eff"
            stroke-width="2"
            stroke-dasharray="5,5"
            fill="none"
            marker-end="url(#arrow)"
          />
          <text x="500" y="230" class="line-text">SLE (已连接)</text>

          <!-- 到从机3 -->
          <path
            d="M 180 275 C 380 320, 620 330, 820 340"
            stroke="#409eff"
            stroke-width="2"
            stroke-dasharray="5,5"
            fill="none"
            marker-end="url(#arrow)"
          />
          <text x="500" y="300" class="line-text">SLE (已连接)</text>

          <!-- 到从机4 -->
          <path
            d="M 180 275 C 380 380, 620 420, 820 460"
            stroke="#409eff"
            stroke-width="2"
            stroke-dasharray="5,5"
            fill="none"
            marker-end="url(#arrow)"
          />
          <text x="500" y="380" class="line-text">SLE (已连接)</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.content-header p {
  color: #909399;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.card {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.form-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.form-label {
  width: 120px;
  font-weight: 500;
}

.meter {
  flex: 1;
  margin-left: 20px;
}

.meter span {
  display: inline-block;
}

.bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
}

.inner {
  height: 100%;
  border-radius: 4px;
}

.cpu {
  width: 25%;
  background-color: #409eff;
}

.mem {
  width: 40%;
  background-color: #67c23a;
}

.flash {
  width: 30%;
  background-color: #e6a23c;
}

.disk {
  width: 20%;
  background-color: #909399;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.status-online {
  background-color: #f0f9eb;
  color: #67c23a;
}

.topology-wrapper {
  position: relative;
  padding: 20px;
  height: 550px;
  overflow: hidden;
}

.host {
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 2;
}

.slave {
  position: absolute;
  right: 5%;
  display: flex;
  align-items: center;
  z-index: 2;
}

.slave-1 {
  top: 8%;
}

.slave-2 {
  top: 30%;
}

.slave-3 {
  top: 52%;
}

.slave-4 {
  top: 74%;
}

.device-card {
  width: 80px;
  height: 120px;
  background-color: #f5f7fa;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #409eff;
}

.host-card {
  border-color: #ff7f00;
}

.device-inner {
  width: 60px;
  height: 80px;
  border-radius: 4px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.host-inner {
  background-color: #ff7f00;
}

.slave-inner {
  background-color: #409eff;
}

.device-info {
  margin-left: 15px;
  text-align: left;
}

.host-info {
  margin-left: 0;
  margin-right: 15px;
  text-align: right;
}

.device-info.right {
  text-align: left;
}

.device-name {
  font-weight: bold;
  font-size: 14px;
}

.device-text {
  font-size: 12px;
  color: #666666;
}

.topology-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.line-text {
  font-size: 11px;
  fill: #409eff;
  text-anchor: middle;
}
</style>

