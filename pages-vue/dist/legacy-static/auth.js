const rolePermissions = {
    admin: {
        name: '管理员',
        description: '拥有系统全部功能权限',
        permissions: ['dashboard', 'elderly-list', 'elderly-detail', 'orders', 'alerts', 'visit-plan', 'devices', 'emergency-resources', 'monitor', 'doctors', 'reports', 'ai-risk-warning', 'ai-diagnosis', 'settings'],
        color: '#ff4757'
    },
    doctor: {
        name: '医生',
        description: '派医工单、健康数据查看、处置记录',
        permissions: ['dashboard', 'elderly-list', 'elderly-detail', 'orders', 'alerts', 'monitor', 'reports', 'ai-risk-warning', 'ai-diagnosis'],
        color: '#3498db'
    },
    nurse: {
        name: '护理员',
        description: '巡访计划、日常关怀、设备查看',
        permissions: ['dashboard', 'elderly-list', 'elderly-detail', 'visit-plan', 'devices', 'alerts'],
        color: '#27ae60'
    },
    service: {
        name: '客服',
        description: '家属沟通、通知推送',
        permissions: ['dashboard', 'elderly-list', 'elderly-detail', 'alerts', 'reports'],
        color: '#f39c12'
    }
};

const pageNames = {
    'dashboard.html': '控制台',
    'elderly-list.html': '老年人列表',
    'elderly-detail.html': '老年人详情',
    'orders.html': '派医工单',
    'alerts.html': '警报中心',
    'visit-plan.html': '巡访计划',
    'devices.html': '设备管理',
    'emergency-resources.html': '应急资源',
    'monitor.html': '实时监控',
    'doctors.html': '医生管理',
    'reports.html': '数据报告',
    'settings.html': '系统设置',
    'ai-risk-warning.html': 'AI健康风险预警',
    'ai-diagnosis.html': 'AI辅助诊断'
};

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        return null;
    }
    return JSON.parse(userStr);
}

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return user;
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

function switchRole() {
    const roles = ['admin', 'doctor', 'nurse', 'service'];
    const user = getCurrentUser();
    if (!user) return;

    const currentIndex = roles.indexOf(user.role);
    const nextIndex = (currentIndex + 1) % roles.length;
    const nextRole = roles[nextIndex];
    const role = rolePermissions[nextRole];

    user.role = nextRole;
    user.roleName = role.name;
    user.permissions = role.permissions;
    localStorage.setItem('currentUser', JSON.stringify(user));

    location.reload();
}

function createNavBar() {
    const user = checkAuth();
    if (!user) return;

    const role = rolePermissions[user.role] || rolePermissions.admin;
    const currentPage = window.location.pathname.split('/').pop();
    const pageName = pageNames[currentPage] || '未知页面';

    const navBar = document.createElement('div');
    navBar.id = 'globalNavBar';
    navBar.innerHTML = `
        <style>
            #globalNavBar {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            #globalNavBar .nav-left {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            #globalNavBar .nav-logo {
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #globalNavBar .nav-breadcrumb {
                font-size: 13px;
                opacity: 0.8;
            }
            #globalNavBar .nav-breadcrumb a {
                color: white;
                text-decoration: none;
            }
            #globalNavBar .nav-breadcrumb a:hover {
                text-decoration: underline;
            }
            #globalNavBar .nav-right {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            #globalNavBar .user-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #globalNavBar .user-avatar {
                width: 35px;
                height: 35px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
            #globalNavBar .user-name {
                font-size: 14px;
            }
            #globalNavBar .role-badge {
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
            }
            #globalNavBar .nav-btn {
                padding: 8px 14px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            #globalNavBar .nav-btn-outline {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.5);
                color: white;
            }
            #globalNavBar .nav-btn-outline:hover {
                background: rgba(255,255,255,0.1);
            }
            #globalNavBar .nav-btn-danger {
                background: rgba(255,71,87,0.8);
                color: white;
            }
            #globalNavBar .nav-btn-danger:hover {
                background: #ff4757;
            }
            @media (max-width: 768px) {
                #globalNavBar {
                    flex-direction: column;
                    gap: 10px;
                    padding: 10px 15px;
                }
                #globalNavBar .nav-left {
                    width: 100%;
                    justify-content: space-between;
                }
                #globalNavBar .nav-right {
                    width: 100%;
                    justify-content: space-between;
                }
            }
        </style>
        <div class="nav-left">
            <div class="nav-logo">
                <i class="fas fa-heartbeat"></i>
                <span>老年人监护系统</span>
            </div>
            <div class="nav-breadcrumb">
                <a href="index.html">首页</a> / ${pageName}
            </div>
        </div>
        <div class="nav-right">
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <span class="user-name">${user.username || 'demo'}</span>
                <span class="role-badge" style="background: ${role.color};">${role.name}</span>
            </div>
            <button class="nav-btn nav-btn-outline" onclick="switchRole()">
                <i class="fas fa-exchange-alt"></i> 切换角色
            </button>
            <button class="nav-btn nav-btn-danger" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> 退出
            </button>
        </div>
    `;

    document.body.insertBefore(navBar, document.body.firstChild);
}

function initAuth() {
    createNavBar();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
