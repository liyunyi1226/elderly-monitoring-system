<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api";
import { rolePermissions, roleUsernames } from "../config/roles";

const selectedRole = ref("admin");
const username = ref(roleUsernames.admin);
const password = ref("123456");
const loading = ref(false);
const router = useRouter();
const roleCards = [
  { key: "admin", icon: "fa-user-shield", title: "管理员", tip: "全部权限" },
  { key: "doctor", icon: "fa-user-md", title: "医生", tip: "派医工单、健康数据" },
  { key: "nurse", icon: "fa-user-nurse", title: "护理员", tip: "巡访计划、日常关怀" },
  { key: "service", icon: "fa-headset", title: "客服", tip: "家属沟通、通知推送" }
];

function selectRole(role) {
  selectedRole.value = role;
  username.value = roleUsernames[role];
}

async function handleLogin() {
  if (!username.value || !password.value) {
    window.alert("请输入账号和密码");
    return;
  }

  loading.value = true;
  try {
    const result = await api.auth.login(username.value, password.value, selectedRole.value);
    const role = rolePermissions[selectedRole.value];
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: result.data.id,
        username: result.data.username,
        realName: result.data.realName,
        role: result.data.role,
        roleName: role.name,
        permissions: role.permissions,
        loginTime: new Date().toISOString()
      })
    );
    router.push("/home");
  } catch (error) {
    window.alert(`登录失败：${error.message}`);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <h1><i class="fas fa-heartbeat"></i> 老年人监护系统</h1>
        <p>
          聚焦老龄化下空巢老人监护与异地照护难题，通过智能体把事后报警升级为主动感知与智能响应。
        </p>
        <div class="features">
          <div class="feature-item">
            <i class="fas fa-shield-alt"></i>
            <span>AI健康风险预警，提前72小时预测</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-robot"></i>
            <span>智能语音应急助手，意图识别准确率91%</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-ambulance"></i>
            <span>一键派医响应，平均响应时间3.2分钟</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-mobile-alt"></i>
            <span>三端联动：老人端、子女端、社区端</span>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-header">
          <h2>欢迎登录</h2>
          <p>请选择您的角色并输入账号信息</p>
        </div>
        <div class="role-selector">
          <div
            v-for="item in roleCards"
            :key="item.key"
            class="role-card"
            :class="{ selected: selectedRole === item.key }"
            @click="selectRole(item.key)"
          >
            <i class="fas" :class="item.icon"></i>
            <h4>{{ item.title }}</h4>
            <p>{{ item.tip }}</p>
          </div>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label><i class="fas fa-user"></i> 账号</label>
            <input v-model="username" type="text" placeholder="请输入账号" required />
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 密码</label>
            <input v-model="password" type="password" placeholder="请输入密码" required />
          </div>
          <div class="remember-forgot">
            <label><input type="checkbox" checked /> 记住我</label>
            <a href="javascript:void(0)">忘记密码？</a>
          </div>
          <button type="submit" class="login-btn" :disabled="loading">
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'"></i>
            {{ loading ? "登录中..." : "登录系统" }}
          </button>
        </form>
        <div class="demo-tip">
          <i class="fas fa-info-circle"></i>
          <strong>测试账号：</strong>admin / doctor_zhang / nurse_li / service_wang，密码都是 123456
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
.login-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  max-width: 900px;
  width: 100%;
}
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 60px 40px;
  color: #fff;
}
.login-left h1 {
  font-size: 28px;
  margin-bottom: 20px;
}
.login-left p {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.8;
  margin-bottom: 30px;
}
.features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}
.feature-item i {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-right {
  flex: 1;
  padding: 60px 40px;
}
.login-header {
  text-align: center;
  margin-bottom: 30px;
}
.login-header h2 {
  font-size: 24px;
  margin-bottom: 10px;
}
.login-header p {
  color: #666;
  font-size: 14px;
}
.role-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.role-card {
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}
.role-card:hover {
  border-color: #667eea;
  background: #f8f9ff;
}
.role-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
.role-card i {
  font-size: 26px;
  margin-bottom: 8px;
  color: #667eea;
}
.role-card.selected i {
  color: #fff;
}
.role-card h4 {
  font-size: 14px;
  margin: 4px 0;
}
.role-card p {
  margin: 0;
  font-size: 11px;
  color: #999;
}
.role-card.selected p {
  color: rgba(255, 255, 255, 0.85);
}
.form-group {
  margin-bottom: 14px;
}
.form-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
  color: #666;
}
.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}
.remember-forgot {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin: 6px 0 20px;
}
.remember-forgot a {
  color: #667eea;
  text-decoration: none;
}
.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: 0;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.demo-tip {
  margin-top: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 12px;
  color: #666;
}
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  .login-left,
  .login-right {
    padding: 30px 24px;
  }
  .role-selector {
    grid-template-columns: 1fr;
  }
}
</style>
