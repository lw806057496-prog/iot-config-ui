import { defineStore } from 'pinia';

export const useWirelessStore = defineStore('wireless', {
  state: () => ({
    mode: 'sle',
    workMode: 'host'
  }),
  actions: {
    setMode(mode) {
      this.mode = mode;
    },
    setWorkMode(workMode) {
      this.workMode = workMode;
    }
  }
});

