<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title">用户管理</div>
      <div class="page-subtitle">修改登录用户名和密码。</div>
    </div>
    <el-card class="card" shadow="never">
      <template #header><span>用户信息</span></template>
      <el-form label-width="140px" :model="form" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" style="width: 360px" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" style="width: 360px" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" style="width: 360px" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
const formRef = ref(null);
const form = reactive({
  username: 'admin',
  password: '',
  confirmPassword: ''
});
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'));
  } else {
    callback();
  }
};
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
};
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      window.alert('已保存用户信息（示例页面，待接入接口）');
      form.password = '';
      form.confirmPassword = '';
    }
  });
};
</script>
<style scoped>
.page { padding: 16px; }
.page-header { padding: 12px 16px; background: #fff; border-bottom: 1px solid #ebeef5; }
.page-title { font-size: 16px; font-weight: 600; color: #303133; }
.page-subtitle { margin-top: 6px; font-size: 12px; color: #909399; }
.card { margin-top: 16px; }
</style>
