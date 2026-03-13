import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';
import Overview from '../views/Overview.vue';
import WirelessMode from '../views/network/WirelessMode.vue';
import StarFlashHost from '../views/network/StarFlashHost.vue';
import WiFiNetwork from '../views/network/WiFiNetwork.vue';
import WifiHost from '../views/network/WifiHost.vue';
import LanBasic from '../views/network/LanBasic.vue';
import WirelessSurvey from '../views/network/WirelessSurvey.vue';
import EthernetSwitch from '../views/interface/EthernetSwitch.vue';
import RS485 from '../views/interface/RS485.vue';
import CAN from '../views/interface/CAN.vue';
import DIDO from '../views/interface/DIDO.vue';
import TimeZone from '../views/system/TimeZone.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Overview', component: Overview },
      {
        path: 'network',
        children: [
          { path: '', redirect: '/network/wireless-mode' },
          { path: 'wireless-mode', name: 'WirelessMode', component: WirelessMode },
          { path: 'star-flash-host', name: 'StarFlashHost', component: StarFlashHost },
          { path: 'wifi-network', name: 'WiFiNetwork', component: WiFiNetwork },
          { path: 'wifi-host', name: 'WifiHost', component: WifiHost },
          { path: 'lan-basic', name: 'LanBasic', component: LanBasic },
          { path: 'wireless-survey', name: 'WirelessSurvey', component: WirelessSurvey }
        ]
      },
      {
        path: 'interface',
        children: [
          { path: '', redirect: '/interface/ethernet-switch' },
          { path: 'ethernet-switch', name: 'EthernetSwitch', component: EthernetSwitch },
          { path: 'rs485', name: 'RS485', component: RS485 },
          { path: 'can', name: 'CAN', component: CAN },
          { path: 'dido', name: 'DIDO', component: DIDO }
        ]
      },
      {
        path: 'system',
        children: [
          { path: '', redirect: '/system/time-zone' },
          { path: 'time-zone', name: 'TimeZone', component: TimeZone }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

