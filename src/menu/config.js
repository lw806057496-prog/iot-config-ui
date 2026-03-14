export const TOP_SECTIONS = [
  { key: 'overview', label: '概览', to: '/' },
  { key: 'network', label: '网络', to: '/network' },
  { key: 'interface', label: '接口', to: '/interface' },
  { key: 'system', label: '系统', to: '/system' }
];

export const SIDE_MENUS = {
  overview: [],
  network: [
    { key: 'wireless-mode', label: '无线模式', to: '/network/wireless-mode' },
    { key: 'star-flash-host', label: '星闪网络', to: '/network/star-flash-host', mode: 'sle' },
    { key: 'wifi-network', label: 'WiFi网络', to: '/network/wifi-network', mode: 'wifi' },
    { key: 'lan-basic', label: 'LAN', to: '/network/lan-basic' },
    { key: 'wireless-survey', label: '网络诊断', to: '/network/wireless-survey' }
  ],
  interface: [
    { key: 'ethernet-switch', label: '网口', to: '/interface/ethernet-switch' },
    { key: 'rs485', label: 'RS485接口', to: '/interface/rs485' },
    { key: 'can', label: 'CAN接口', to: '/interface/can' },
    { key: 'dido', label: 'DI/DO接口', to: '/interface/dido' }
  ],
  system: [
    { key: 'time-zone', label: '系统时间', to: '/system/time-zone' },
    { key: 'system-log', label: '系统日志', to: '/system/system-log' },
    { key: 'config-manage', label: '配置管理', to: '/system/config-manage' },
    { key: 'firmware-upgrade', label: '固件升级', to: '/system/firmware-upgrade' },
    { key: 'user-manage', label: '用户管理', to: '/system/user-manage' },
    { key: 'remote-manage', label: '远程管理', to: '/system/remote-manage' },
    { key: 'ssh-tool', label: 'SSH工具', to: '/system/ssh-tool' },
    { key: 'system-reboot', label: '系统重启', to: '/system/system-reboot' }
  ]
};

