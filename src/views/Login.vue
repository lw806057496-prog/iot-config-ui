<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <div class="slogan">连接价值<br />价值连接</div>
      </div>
      <div class="login-right">
        <h2>欢迎登录</h2>
        <el-form class="login-form" @submit.prevent="handleLogin">
          <el-form-item label="账号">
            <el-input v-model="username" placeholder="请输入您的账号" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="password" type="password" placeholder="请输入您的密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');

const handleLogin = () => {
  if (!username.value || !password.value) {
    window.alert('请输入账户和密码');
    return;
  }
  router.push('/');
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.login-container {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
}

.login-left {
  background-color: #ff7f00;
  color: white;
  padding: 60px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slogan {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.login-right {
  padding: 60px 40px;
  flex: 1;
}

.login-right h2 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>

