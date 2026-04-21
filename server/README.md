# 老年人监护系统 - 后端服务

## 技术栈
- **后端**: Node.js + Express
- **数据库**: MySQL
- **认证**: Session + Cookie

## 快速开始

### 1. 安装依赖
```bash
cd server
npm install
```

### 2. 配置数据库
编辑 `.env` 文件，修改数据库连接信息：
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=elderly_monitoring
```

### 3. 初始化数据库
```bash
npm run init-db
```

### 4. 启动服务
```bash
npm run dev
```

服务启动后访问: http://localhost:3000

## 默认账号
所有账号密码均为: `123456`

| 用户名 | 角色 | 权限 |
|--------|------|------|
| admin | 管理员 | 全部功能 |
| doctor_zhang | 医生 | 派医工单、健康数据、AI功能 |
| nurse_li | 护理员 | 巡访计划、设备管理 |
| service_wang | 客服 | 家属沟通、数据报告 |

## API 接口

### 认证接口
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/current` - 获取当前用户

### 老年人管理
- `GET /api/elderly/list` - 获取列表
- `GET /api/elderly/:id` - 获取详情
- `POST /api/elderly/create` - 新增
- `PUT /api/elderly/:id` - 更新
- `DELETE /api/elderly/:id` - 删除

### 警报管理
- `GET /api/alerts/list` - 获取列表
- `GET /api/alerts/statistics` - 获取统计
- `PUT /api/alerts/:id/handle` - 处理警报

### 派医工单
- `GET /api/orders/list` - 获取列表
- `POST /api/orders/create` - 创建工单
- `PUT /api/orders/:id/status` - 更新状态
- `PUT /api/orders/:id/complete` - 完成工单

### 设备管理
- `GET /api/devices/list` - 获取列表
- `GET /api/devices/statistics` - 获取统计

### 医生管理
- `GET /api/doctors/list` - 获取列表

### 巡访计划
- `GET /api/visits/list` - 获取列表
- `POST /api/visits/create` - 创建计划
- `PUT /api/visits/:id/complete` - 完成巡访

### 控制台
- `GET /api/dashboard/overview` - 获取概览
- `GET /api/dashboard/trend` - 获取趋势

## 数据库表结构

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| elderly | 老年人信息表 |
| doctors | 医生表 |
| devices | 设备表 |
| health_data | 健康数据表 |
| alerts | 警报表 |
| orders | 派医工单表 |
| visits | 巡访计划表 |
| family_communication | 家属沟通记录表 |

## 项目结构
```
server/
├── config/
│   └── database.js      # 数据库配置
├── middleware/
│   └── auth.js          # 认证中间件
├── routes/
│   ├── auth.js          # 认证路由
│   ├── elderly.js       # 老年人路由
│   ├── alerts.js        # 警报路由
│   ├── orders.js        # 工单路由
│   ├── devices.js       # 设备路由
│   ├── doctors.js       # 医生路由
│   ├── visits.js        # 巡访路由
│   └── dashboard.js     # 控制台路由
├── scripts/
│   └── initDatabase.js  # 数据库初始化
├── .env                 # 环境配置
├── package.json
└── server.js            # 入口文件
```
