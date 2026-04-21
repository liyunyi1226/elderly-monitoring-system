# 老年人监护系统

本项目是本地运行的社区老年人监护系统，包含：

- 前端：`pages-vue`（Vue + Vite）
- 后端：`server`（Node.js + Express）
- 数据库：SQLite（位于 `server/data`）

> 当前项目可在 **没有 `pages` 目录** 的情况下正常运行。

## 快速开始（必看）

### 1. 启动后端

```bash
cd "d:\练习\elderly-monitoring-system-main\server"
npm install
npm run init-db
npm run dev
```

后端地址：

- API：`http://localhost:3000`
- 管理页面：`http://localhost:3000/admin-pages`

### 2. 启动前端

```bash
cd "d:\练习\elderly-monitoring-system-main\pages-vue"
npm install
npm run dev
```

前端地址：

- Vue 前端：`http://localhost:5173`

## 目录结构

```text
elderly-monitoring-system-main/
├── pages-vue/                     # 前端工程
│   ├── src/
│   └── public/legacy-static/      # 旧静态页镜像（可直接被后端托管）
├── server/                        # 后端工程
│   ├── config/
│   ├── routes/
│   ├── scripts/
│   ├── data/
│   └── server.js
└── README.md
```

## 后端静态资源兼容逻辑

后端会自动尝试挂载前端资源（按目录存在情况）：

1. `pages-vue/dist`
2. `pages-vue/public/legacy-static`
3. `pages`（如果你后续又加回来也兼容）

因此即使没有 `pages`，也不影响运行。

## 测试账号

- 管理员：`admin / 123456`
- 医生：`doctor_zhang / 123456`
- 护理员：`nurse_li / 123456`
- 客服：`service_wang / 123456`

## 常见问题

### 1) 启动报端口占用

错误通常是 `EADDRINUSE`（3000 或 5173 被占用）。关闭占用进程后重新执行启动命令。

### 2) 数据库异常或数据错乱

在 `server` 目录执行：

```bash
npm run init-db
```

### 3) 页面改了没生效

- Vue 页面：看 `pages-vue/src` 改动是否被热更新。
- `legacy-static` 页面：强制刷新浏览器（`Ctrl + F5`）。

## 功能模块

- 控制台
- 老年人管理
- 医生管理
- 设备管理
- 派医工单
- 警报中心
- 巡访计划
- 实时监控
- AI 风险预警
- AI 辅助诊断
