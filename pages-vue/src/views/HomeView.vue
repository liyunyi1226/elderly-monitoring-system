<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { rolePermissions } from "../config/roles";

const router = useRouter();
const user = computed(() => JSON.parse(localStorage.getItem("currentUser") || "{}"));
const role = computed(() => rolePermissions[user.value.role] || rolePermissions.admin);

const pages = [
  { key: "dashboard", title: "控制台", desc: "待处理工单、今日预警统计、医生在线状态、设备异常提醒", page: "dashboard", icon: "fas fa-tachometer-alt", iconClass: "blue", badge: "核心页面", badgeClass: "primary" },
  { key: "elderly-list", title: "老年人列表", desc: "老年人信息管理、健康状态查看、批量操作、搜索筛选", page: "elderly-list", icon: "fas fa-users", iconClass: "green", badge: "核心页面", badgeClass: "primary" },
  { key: "elderly-detail", title: "老年人详情", desc: "个人信息、实时健康数据、家属沟通记录、派医操作", page: "elderly-detail", icon: "fas fa-user", iconClass: "teal", badge: "核心页面", badgeClass: "primary" },
  { key: "orders", title: "派医工单", desc: "待接单工单、进行中工单、已完成工单、超时未处理工单", page: "orders", icon: "fas fa-clipboard-list", iconClass: "orange", badge: "核心页面", badgeClass: "primary" },
  { key: "alerts", title: "警报中心", desc: "紧急警报、处理时效统计、警告提醒、快速处理", page: "alerts", icon: "fas fa-bell", iconClass: "red", badge: "核心页面", badgeClass: "primary" },
  { key: "visit-plan", title: "巡访计划", desc: "巡访安排、任务生成、记录填写、逾期提醒", page: "visit-plan", icon: "fas fa-calendar-check", iconClass: "green", badge: "核心页面", badgeClass: "primary" },
  { key: "devices", title: "设备管理", desc: "设备状态监控、离线提醒、异常上报、设备更换记录", page: "devices", icon: "fas fa-microchip", iconClass: "purple", badge: "核心页面", badgeClass: "primary" },
  { key: "emergency-resources", title: "应急资源", desc: "附近医院、药店、急救车调度、紧急联系人", page: "emergency-resources", icon: "fas fa-first-aid", iconClass: "red", badge: "核心页面", badgeClass: "primary" },
  { key: "monitor", title: "实时监控", desc: "实时数据、位置地图、异常记录、动态图表", page: "monitor", icon: "fas fa-desktop", iconClass: "purple", badge: "辅助页面", badgeClass: "success" },
  { key: "doctors", title: "医生管理", desc: "医生信息、在线状态、专长管理、工作安排", page: "doctors", icon: "fas fa-user-md", iconClass: "orange", badge: "辅助页面", badgeClass: "success" },
  { key: "reports", title: "数据报告", desc: "统计分析、趋势报告、健康排行、数据导出", page: "reports", icon: "fas fa-chart-bar", iconClass: "yellow", badge: "辅助页面", badgeClass: "success" },
  { key: "settings", title: "系统设置", desc: "个性化预警阈值、通知配置、角色权限、账户管理", page: "settings", icon: "fas fa-cog", iconClass: "pink", badge: "辅助页面", badgeClass: "success" }
];

function openPage(page) {
  window.location.href = `/legacy-static/${page}.html`;
}

function switchRole() {
  const roles = ["admin", "doctor", "nurse", "service"];
  const currentRole = user.value.role || "admin";
  const currentIndex = roles.indexOf(currentRole);
  const nextRole = roles[(currentIndex + 1) % roles.length];
  const nextConfig = rolePermissions[nextRole];
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      ...user.value,
      role: nextRole,
      roleName: nextConfig.name,
      permissions: nextConfig.permissions
    })
  );
  window.location.reload();
}

function logout() {
  localStorage.removeItem("currentUser");
  router.push("/login");
}
</script>

<template>
  <div class="home-page">
    <div class="container">
      <div class="top-bar">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <h4>{{ user.username || "demo" }}</h4>
            <p>{{ role.name }}</p>
          </div>
          <span class="role-badge" :class="role.color">{{ role.name }}</span>
        </div>
        <div class="top-actions">
          <button class="btn btn-outline" @click="switchRole"><i class="fas fa-exchange-alt"></i> 切换角色</button>
          <button class="btn btn-danger" @click="logout"><i class="fas fa-sign-out-alt"></i> 退出登录</button>
        </div>
      </div>

      <div class="header">
        <h1><i class="fas fa-heartbeat"></i> 老年人监护系统</h1>
        <p>社区管理平台 - 功能导航</p>
      </div>

      <div class="permission-notice">
        <i class="fas fa-info-circle"></i>
        <span>当前角色权限：{{ role.description }}</span>
      </div>

      <div class="grid">
        <div
          v-for="item in pages"
          :key="item.key"
          class="card"
          :class="{ disabled: !role.permissions.includes(item.key) }"
          @click="role.permissions.includes(item.key) && openPage(item.page)"
        >
          <div class="card-icon" :class="item.iconClass"><i :class="item.icon"></i></div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <span class="badge" :class="item.badgeClass">{{ item.badge }}</span>
        </div>
      </div>

      <div class="ai-section">
        <div class="ai-section-title">
          <h2><i class="fas fa-robot"></i> AI智能体中心</h2>
          <p>大模型Agent驱动 · 从被动响应到主动预防</p>
        </div>
        <div class="grid ai-grid">
          <div class="card" :class="{ disabled: !role.permissions.includes('ai-risk-warning') }" @click="role.permissions.includes('ai-risk-warning') && openPage('ai-risk-warning')">
            <div class="card-icon ai-blue"><i class="fas fa-shield-alt"></i></div>
            <h3>AI健康风险预警</h3>
            <p>基于多维度数据分析，提前预测健康风险，行为异常检测</p>
            <span class="ai-badge"><i class="fas fa-brain"></i> AI Agent</span>
          </div>
          <div class="card" :class="{ disabled: !role.permissions.includes('ai-diagnosis') }" @click="role.permissions.includes('ai-diagnosis') && openPage('ai-diagnosis')">
            <div class="card-icon ai-purple"><i class="fas fa-stethoscope"></i></div>
            <h3>AI辅助诊断</h3>
            <p>输入异常数据，AI给出病因分析、处置建议、用药建议</p>
            <span class="ai-badge"><i class="fas fa-brain"></i> AI Agent</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page { min-height: 100vh; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.top-bar { background: rgba(255,255,255,.15); backdrop-filter: blur(10px); border-radius: 15px; padding: 15px 25px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; color: #fff; }
.user-info { display: flex; align-items: center; gap: 15px; }
.user-avatar { width: 45px; height: 45px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #667eea; }
.user-details h4 { margin: 0 0 3px; font-size: 15px; }
.user-details p { margin: 0; font-size: 12px; opacity: .8; }
.role-badge { padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; }
.role-admin { background: #ff4757; }
.role-doctor { background: #3498db; }
.role-nurse { background: #27ae60; }
.role-service { background: #f39c12; }
.top-actions { display: flex; gap: 10px; }
.btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; color: #fff; }
.btn-outline { background: transparent; border: 1px solid rgba(255,255,255,.5); }
.btn-danger { background: #ff4757; }
.header { text-align: center; color: #fff; margin-bottom: 24px; }
.header h1 { font-size: 42px; margin: 0 0 10px; }
.header p { margin: 0; font-size: 16px; opacity: .9; }
.permission-notice { background: rgba(255,255,255,.1); border-radius: 10px; padding: 15px 20px; margin-bottom: 20px; color: #fff; display: flex; align-items: center; gap: 10px; font-size: 13px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 20px; }
.card { background: #fff; border-radius: 15px; padding: 25px; text-align: center; transition: all .3s; cursor: pointer; }
.card:hover { transform: translateY(-6px); box-shadow: 0 15px 40px rgba(0,0,0,.2); }
.card.disabled { display: none; }
.card-icon { width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; }
.blue { background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); }
.green { background: linear-gradient(135deg,#11998e 0%,#38ef7d 100%); }
.orange { background: linear-gradient(135deg,#f093fb 0%,#f5576c 100%); }
.red { background: linear-gradient(135deg,#ff416c 0%,#ff4b2b 100%); }
.purple { background: linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%); }
.teal { background: linear-gradient(135deg,#30cfd0 0%,#330867 100%); }
.yellow { background: linear-gradient(135deg,#f6d365 0%,#fda085 100%); }
.pink { background: linear-gradient(135deg,#ffecd2 0%,#fcb69f 100%); }
.card h3 { margin: 0 0 8px; color: #333; font-size: 18px; }
.card p { margin: 0; color: #666; font-size: 13px; line-height: 1.5; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 15px; font-size: 10px; margin-top: 8px; font-weight: 500; }
.badge.primary { background: #e3f2fd; color: #1976d2; }
.badge.success { background: #e8f5e9; color: #388e3c; }
.ai-section { margin-top: 30px; }
.ai-section-title { text-align: center; color: #fff; margin-bottom: 20px; }
.ai-badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 11px; margin-top: 10px; font-weight: 500; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: #fff; }
.ai-blue { background: linear-gradient(135deg,#00c6fb 0%,#005bea 100%); }
.ai-purple { background: linear-gradient(135deg,#a8edea 0%,#fed6e3 100%); }
@media (max-width: 768px) {
  .top-bar { flex-direction: column; gap: 15px; }
  .header h1 { font-size: 28px; }
}
</style>
