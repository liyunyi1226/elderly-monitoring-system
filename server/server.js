require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const { initDatabase } = require('./config/database');

const authRoutes = require('./routes/auth');
const elderlyRoutes = require('./routes/elderly');
const alertRoutes = require('./routes/alerts');
const orderRoutes = require('./routes/orders');
const deviceRoutes = require('./routes/devices');
const doctorRoutes = require('./routes/doctors');
const visitRoutes = require('./routes/visits');
const dashboardRoutes = require('./routes/dashboard');
const adminPagesRoutes = require('./routes/admin-pages');

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'elderly_monitoring_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

const pagesDir = path.join(__dirname, '../pages');
const vueDistDir = path.join(__dirname, '../pages-vue/dist');
const legacyStaticDir = path.join(__dirname, '../pages-vue/public/legacy-static');

if (fs.existsSync(vueDistDir)) {
    app.use(express.static(vueDistDir));
}
if (fs.existsSync(legacyStaticDir)) {
    app.use('/legacy-static', express.static(legacyStaticDir));
}
if (fs.existsSync(pagesDir)) {
    app.use(express.static(pagesDir));
} else if (fs.existsSync(legacyStaticDir)) {
    // pages 目录缺失时，自动回退到 legacy-static
    app.use(express.static(legacyStaticDir));
}

app.use('/api/auth', authRoutes);
app.use('/api/elderly', elderlyRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/admin-pages', adminPagesRoutes);

app.get('/', (req, res) => {
    if (fs.existsSync(path.join(pagesDir, 'login.html'))) {
        return res.redirect('/login.html');
    }
    if (fs.existsSync(path.join(legacyStaticDir, 'login.html'))) {
        return res.redirect('/legacy-static/login.html');
    }
    if (fs.existsSync(path.join(vueDistDir, 'index.html'))) {
        return res.redirect('/index.html');
    }
    return res.status(500).send('未找到可用前端资源目录（pages / pages-vue/public/legacy-static / pages-vue/dist）');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initDatabase();
        
        app.listen(PORT, () => {
            console.log(`=================================`);
            console.log(`老年人监护系统后端服务已启动`);
            console.log(`端口: ${PORT}`);
            console.log(`访问地址: http://localhost:${PORT}`);
            console.log(`=================================`);
        });
    } catch (error) {
        console.error('服务器启动失败:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
