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
    { key: 'dido', label: 'DI/DO接口', to: '/interface/dido' },
    { key: 'expansion', label: '拓展机接口', to: '/interface/expansion' }
  ],
  system: [{ key: 'time-zone', label: '系统时间', to: '/system/time-zone' }]
};

