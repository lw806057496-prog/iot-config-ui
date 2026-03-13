<template>
  <el-container class="layout-root">
    <el-header class="top-nav">
      <div class="logo">USR-NL200</div>

      <div
        v-for="item in topNavItems"
        :key="item.key"
        class="nav-item"
        :class="{ active: activeTop === item.key }"
        @click="goTop(item)"
      >
        {{ item.label }}
      </div>

      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ currentLanguage }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="currentLanguage = '中文'">中文</el-dropdown-item>
              <el-dropdown-item @click="currentLanguage = 'English'">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown class="user-menu">
          <span class="el-dropdown-link">admin</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="layout-body">
      <el-aside v-if="shouldShowAside" width="220px" class="sidebar">
        <el-menu :default-active="activeSide" class="el-menu-vertical-demo" router>
          <el-menu-item v-for="item in sideItems" :key="item.key" :index="item.to">
            {{ item.label }}
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SIDE_MENUS, TOP_SECTIONS } from '../menu/config';
import { useWirelessStore } from '../stores/wireless';

const router = useRouter();
const route = useRoute();
const wirelessStore = useWirelessStore();

const currentLanguage = ref('English');

const topNavItems = TOP_SECTIONS;

const activeTop = computed(() => {
  const seg = String(route.path || '').split('/').filter(Boolean)[0];
  return seg || 'overview';
});

const sideItems = computed(() => {
  const items = SIDE_MENUS[activeTop.value] ?? [];
  const mode = wirelessStore.mode || 'sle';
  
  // 根据模式过滤菜单项
  return items.filter(item => {
    // 如果菜单项没有 mode 属性，总是显示
    if (!item.mode) return true;
    
    // 星闪网络只在 SLE 模式显示
    if (item.mode === 'sle') return mode === 'sle';
    
    // WiFi网络只在 WiFi 模式显示
    if (item.mode === 'wifi') return mode === 'wifi';
    
    return true;
  });
});

const shouldShowAside = computed(() => sideItems.value.length > 0);

const activeSide = ref('');
watchEffect(() => {
  activeSide.value = route.path;
});

const goTop = async (item) => {
  await router.push(item.to);

  const items = SIDE_MENUS[item.key] ?? [];
  if (items.length > 0 && router.currentRoute.value.path === item.to) {
    await router.replace(items[0].to);
  }
};

const handleLogout = () => {
  router.push('/login');
};
</script>

<style scoped>
.layout-root {
  height: 100vh;
}

.top-nav {
  background-color: #ff7f00;
  color: white;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 18px;
  font-weight: bold;
  margin-right: 40px;
}

.nav-item {
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid white;
}

.user-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.layout-body {
  min-height: 0;
  flex: 1;
}

.sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
}

.content {
  background-color: #f5f7fa;
  padding: 0;
}
</style>

