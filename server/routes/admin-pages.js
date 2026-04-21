const express = require('express');
const router = express.Router();
const { all, get, run } = require('../config/database');

function layout(title, content, currentPath = '/admin-pages') {
    const navItems = [
        { href: '/admin-pages', label: '总览' },
        { href: '/admin-pages/elderly', label: '老人' },
        { href: '/admin-pages/doctors', label: '医生' },
        { href: '/admin-pages/devices', label: '设备' },
        { href: '/admin-pages/alerts', label: '警报' },
        { href: '/admin-pages/orders', label: '工单' },
        { href: '/admin-pages/visits', label: '巡访' }
    ];
    const navHtml = navItems
        .map((item) => {
            const active = item.href === currentPath ? 'active' : '';
            return `<a class="${active}" href="${item.href}">${item.label}</a>`;
        })
        .join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: "Microsoft YaHei", sans-serif; margin: 0; background: #f4f7fb; color: #1f2937; }
    .shell { max-width: 1400px; margin: 0 auto; padding: 24px; display: flex; gap: 18px; align-items: flex-start; }
    .wrap { flex: 1; min-width: 0; }
    .sidebar {
      width: 220px; position: sticky; top: 16px; background: #fff; border-radius: 14px;
      border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(15,23,42,.06); padding: 14px;
    }
    .sidebar h3 { margin: 0 0 10px; font-size: 15px; color: #334155; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    .sub { margin: 0 0 18px; color: #6b7280; font-size: 13px; }
    .nav { display: flex; flex-direction: column; gap: 8px; }
    .nav a {
      text-decoration: none; color: #334155; background: #f1f5f9; padding: 10px 12px;
      border-radius: 10px; font-size: 13px; font-weight: 600; transition: .2s ease;
    }
    .nav a:hover { background: #cbd5e1; }
    .nav a.active { color: #fff; background: linear-gradient(135deg, #2563eb, #1d4ed8); }
    .card {
      background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      border: 1px solid #e5e7eb;
    }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 12px; }
    .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    .stat .k { color: #64748b; font-size: 12px; margin-bottom: 6px; }
    .stat .v { font-size: 24px; font-weight: 700; color: #0f172a; }
    .table-wrap {
      overflow: auto; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;
      box-shadow: 0 10px 30px rgba(15,23,42,.05);
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #eef2f7; padding: 10px 12px; text-align: left; font-size: 13px; white-space: nowrap; }
    th { background: #f8fafc; color: #475569; position: sticky; top: 0; z-index: 1; }
    tr:hover td { background: #f8fbff; }
    .muted { color: #64748b; font-size: 12px; margin-top: 8px; }
    .actions { display: flex; gap: 8px; margin: 0 0 12px; flex-wrap: wrap; }
    .btn { border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; font-size: 12px; text-decoration: none; display: inline-block; }
    .btn.primary { background: #2563eb; color: #fff; }
    .btn.warn { background: #f59e0b; color: #fff; }
    .btn.danger { background: #ef4444; color: #fff; }
    .btn.light { background: #e2e8f0; color: #0f172a; }
    form.inline { display: inline; }
    .form-card { margin-top: 10px; }
    .form-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
    .form-grid input, .form-grid select { width: 100%; padding: 8px; border: 1px solid #dbe2ea; border-radius: 8px; }
    .hint { font-size: 12px; color: #64748b; margin-bottom: 8px; }
    @media (max-width: 960px) {
      .shell { flex-direction: column; }
      .sidebar { width: 100%; position: static; }
      .form-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <h3>数据导航</h3>
      <div class="nav">${navHtml}</div>
    </aside>
    <div class="wrap">
      <h1>${title}</h1>
      <p class="sub">后端直接渲染 · 快速查看数据库实时数据</p>
      ${content}
    </div>
  </div>
</body>
</html>`;
}

function table(headers, rows) {
    const thead = `<tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>`;
    const tbody = rows.length
        ? rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')
        : '<tr><td colspan="99">暂无数据</td></tr>';
    return `<div class="table-wrap"><table><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
}

function sanitize(v) {
    return (v ?? '').toString().trim();
}

router.get('/', (req, res) => {
    const elderlyCount = all('SELECT COUNT(*) as c FROM elderly')[0]?.c || 0;
    const doctorCount = all('SELECT COUNT(*) as c FROM doctors')[0]?.c || 0;
    const deviceCount = all('SELECT COUNT(*) as c FROM devices')[0]?.c || 0;
    const alertCount = all('SELECT COUNT(*) as c FROM alerts')[0]?.c || 0;
    const orderCount = all('SELECT COUNT(*) as c FROM orders')[0]?.c || 0;
    const visitCount = all('SELECT COUNT(*) as c FROM visits')[0]?.c || 0;

    const html = layout(
        '数据库数据总览',
        `<div class="card">
          <div class="stats">
            <div class="stat"><div class="k">老人数量</div><div class="v">${elderlyCount}</div></div>
            <div class="stat"><div class="k">医生数量</div><div class="v">${doctorCount}</div></div>
            <div class="stat"><div class="k">设备数量</div><div class="v">${deviceCount}</div></div>
            <div class="stat"><div class="k">警报数量</div><div class="v">${alertCount}</div></div>
            <div class="stat"><div class="k">工单数量</div><div class="v">${orderCount}</div></div>
            <div class="stat"><div class="k">巡访数量</div><div class="v">${visitCount}</div></div>
          </div>
          <p class="muted">这是后端直接渲染的简易页面，用于快速查看数据库数据。</p>
        </div>`,
        req.path
    );
    res.send(html);
});

router.get('/elderly', (req, res) => {
    const rows = all('SELECT id, name, gender, phone, health_status, risk_level, address FROM elderly ORDER BY id DESC LIMIT 100');
    const html = layout('老人数据', table(
        ['ID', '姓名', '性别', '电话', '健康状态', '风险等级', '地址', '操作'],
        rows.map((r) => [
            r.id, r.name, r.gender, r.phone, r.health_status, r.risk_level, r.address,
            `<a class="btn light" href="/admin-pages/elderly/edit/${r.id}">编辑</a>
             <form class="inline" method="POST" action="/admin-pages/elderly/delete">
               <input type="hidden" name="id" value="${r.id}" />
               <button class="btn danger" type="submit" onclick="return confirm('确定删除该记录吗？')">删除</button>
             </form>`
        ])
    ) + `<div class="actions"><a class="btn primary" href="/admin-pages/elderly/new">新增老人</a></div>`,
    req.path);
    res.send(html);
});

router.get('/elderly/new', (req, res) => {
    const html = layout('新增老人', `
    <div class="card form-card">
      <form method="POST" action="/admin-pages/elderly/create">
        <div class="form-grid">
          <input name="name" placeholder="姓名" required />
          <select name="gender"><option value="男">男</option><option value="女">女</option></select>
          <input name="phone" placeholder="电话" />
          <input name="address" placeholder="地址" />
          <input name="health_status" placeholder="健康状态" value="良好" />
          <input name="risk_level" placeholder="风险等级" value="低风险" />
        </div>
        <div class="actions" style="margin-top:10px">
          <button class="btn primary" type="submit">保存</button>
          <a class="btn light" href="/admin-pages/elderly">返回</a>
        </div>
      </form>
    </div>
    `, req.path);
    res.send(html);
});

router.get('/elderly/edit/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = get('SELECT * FROM elderly WHERE id = ?', [id]);
    if (!item) return res.redirect('/admin-pages/elderly');
    const html = layout(`编辑老人 #${id}`, `
    <div class="card form-card">
      <form method="POST" action="/admin-pages/elderly/update">
        <input type="hidden" name="id" value="${item.id}" />
        <div class="form-grid">
          <input name="name" value="${item.name || ''}" required />
          <select name="gender"><option value="男" ${item.gender === '男' ? 'selected' : ''}>男</option><option value="女" ${item.gender === '女' ? 'selected' : ''}>女</option></select>
          <input name="phone" value="${item.phone || ''}" />
          <input name="address" value="${item.address || ''}" />
          <input name="health_status" value="${item.health_status || '良好'}" />
          <input name="risk_level" value="${item.risk_level || '低风险'}" />
        </div>
        <div class="actions" style="margin-top:10px">
          <button class="btn primary" type="submit">保存修改</button>
          <a class="btn light" href="/admin-pages/elderly">返回</a>
        </div>
      </form>
    </div>
    `, req.path);
    res.send(html);
});

router.post('/elderly/create', (req, res) => {
    const name = sanitize(req.body.name);
    if (!name) return res.redirect('/admin-pages/elderly');
    run(
        `INSERT INTO elderly (name, gender, phone, address, health_status, risk_level)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            name,
            sanitize(req.body.gender) || '男',
            sanitize(req.body.phone),
            sanitize(req.body.address),
            sanitize(req.body.health_status) || '良好',
            sanitize(req.body.risk_level) || '低风险'
        ]
    );
    res.redirect('/admin-pages/elderly');
});

router.post('/elderly/update', (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (!id) return res.redirect('/admin-pages/elderly');
    run(
        `UPDATE elderly SET name = ?, gender = ?, phone = ?, address = ?, health_status = ?, risk_level = ?
         WHERE id = ?`,
        [
            sanitize(req.body.name),
            sanitize(req.body.gender) || '男',
            sanitize(req.body.phone),
            sanitize(req.body.address),
            sanitize(req.body.health_status) || '良好',
            sanitize(req.body.risk_level) || '低风险',
            id
        ]
    );
    res.redirect('/admin-pages/elderly');
});

router.post('/elderly/delete', (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (id) run('DELETE FROM elderly WHERE id = ?', [id]);
    res.redirect('/admin-pages/elderly');
});

router.get('/doctors', (req, res) => {
    const rows = all('SELECT id, name, phone, specialization, status, rating FROM doctors ORDER BY id DESC LIMIT 100');
    const html = layout('医生数据', table(
        ['ID', '姓名', '电话', '专长', '状态', '评分', '操作'],
        rows.map((r) => [
            r.id, r.name, r.phone, r.specialization, r.status, r.rating,
            `<a class="btn light" href="/admin-pages/doctors/edit/${r.id}">编辑</a>
             <form class="inline" method="POST" action="/admin-pages/doctors/delete">
               <input type="hidden" name="id" value="${r.id}" />
               <button class="btn danger" type="submit" onclick="return confirm('确定删除该医生吗？')">删除</button>
             </form>`
        ])
    ) + `<div class="actions"><a class="btn primary" href="/admin-pages/doctors/new">新增医生</a></div>`,
    req.path);
    res.send(html);
});

router.get('/doctors/new', (req, res) => {
    const html = layout('新增医生', `
    <div class="card form-card">
      <form method="POST" action="/admin-pages/doctors/create">
        <div class="form-grid">
          <input name="name" placeholder="姓名" required />
          <input name="phone" placeholder="电话" />
          <input name="specialization" placeholder="专长" />
          <select name="status"><option value="在线">在线</option><option value="忙碌">忙碌</option><option value="离线" selected>离线</option></select>
          <input name="rating" value="5" />
          <input name="hospital" placeholder="医院" />
        </div>
        <div class="actions" style="margin-top:10px">
          <button class="btn primary" type="submit">保存</button>
          <a class="btn light" href="/admin-pages/doctors">返回</a>
        </div>
      </form>
    </div>
    `, req.path);
    res.send(html);
});

router.get('/doctors/edit/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = get('SELECT * FROM doctors WHERE id = ?', [id]);
    if (!item) return res.redirect('/admin-pages/doctors');
    const html = layout(`编辑医生 #${id}`, `
    <div class="card form-card">
      <form method="POST" action="/admin-pages/doctors/update">
        <input type="hidden" name="id" value="${item.id}" />
        <div class="form-grid">
          <input name="name" value="${item.name || ''}" required />
          <input name="phone" value="${item.phone || ''}" />
          <input name="specialization" value="${item.specialization || ''}" />
          <select name="status"><option value="在线" ${item.status === '在线' ? 'selected' : ''}>在线</option><option value="忙碌" ${item.status === '忙碌' ? 'selected' : ''}>忙碌</option><option value="离线" ${item.status === '离线' ? 'selected' : ''}>离线</option></select>
          <input name="rating" value="${item.rating || 5}" />
          <input name="hospital" value="${item.hospital || ''}" />
        </div>
        <div class="actions" style="margin-top:10px">
          <button class="btn primary" type="submit">保存修改</button>
          <a class="btn light" href="/admin-pages/doctors">返回</a>
        </div>
      </form>
    </div>
    `, req.path);
    res.send(html);
});

router.post('/doctors/create', (req, res) => {
    const name = sanitize(req.body.name);
    if (!name) return res.redirect('/admin-pages/doctors');
    run(
        `INSERT INTO doctors (name, phone, specialization, status, rating, hospital)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            name,
            sanitize(req.body.phone),
            sanitize(req.body.specialization),
            sanitize(req.body.status) || '离线',
            Number(req.body.rating) || 5,
            sanitize(req.body.hospital)
        ]
    );
    res.redirect('/admin-pages/doctors');
});

router.post('/doctors/update', (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (!id) return res.redirect('/admin-pages/doctors');
    run(
        `UPDATE doctors SET name = ?, phone = ?, specialization = ?, status = ?, rating = ?, hospital = ?
         WHERE id = ?`,
        [
            sanitize(req.body.name),
            sanitize(req.body.phone),
            sanitize(req.body.specialization),
            sanitize(req.body.status) || '离线',
            Number(req.body.rating) || 5,
            sanitize(req.body.hospital),
            id
        ]
    );
    res.redirect('/admin-pages/doctors');
});

router.post('/doctors/delete', (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (id) run('DELETE FROM doctors WHERE id = ?', [id]);
    res.redirect('/admin-pages/doctors');
});

router.get('/devices', (req, res) => {
    const rows = all('SELECT id, device_id, elderly_id, device_type, status, battery_level, last_online_at FROM devices ORDER BY id DESC LIMIT 100');
    const html = layout('设备数据', table(
        ['ID', '设备ID', '老人ID', '类型', '状态', '电量', '最后在线'],
        rows.map((r) => [r.id, r.device_id, r.elderly_id, r.device_type, r.status, r.battery_level, r.last_online_at])
    ), req.path);
    res.send(html);
});

router.get('/alerts', (req, res) => {
    const rows = all('SELECT id, elderly_id, alert_type, alert_level, title, status, created_at FROM alerts ORDER BY id DESC LIMIT 100');
    const html = layout('警报数据', table(
        ['ID', '老人ID', '类型', '等级', '标题', '状态', '创建时间'],
        rows.map((r) => [r.id, r.elderly_id, r.alert_type, r.alert_level, r.title, r.status, r.created_at])
    ), req.path);
    res.send(html);
});

router.get('/orders', (req, res) => {
    const rows = all('SELECT id, order_no, elderly_id, doctor_id, urgency, status, created_at FROM orders ORDER BY id DESC LIMIT 100');
    const html = layout('工单数据', table(
        ['ID', '工单号', '老人ID', '医生ID', '紧急度', '状态', '创建时间'],
        rows.map((r) => [r.id, r.order_no, r.elderly_id, r.doctor_id, r.urgency, r.status, r.created_at])
    ), req.path);
    res.send(html);
});

router.get('/visits', (req, res) => {
    const rows = all('SELECT id, elderly_id, nurse_id, plan_date, plan_time, status, created_at FROM visits ORDER BY id DESC LIMIT 100');
    const html = layout('巡访数据', table(
        ['ID', '老人ID', '护士ID', '计划日期', '计划时间', '状态', '创建时间'],
        rows.map((r) => [r.id, r.elderly_id, r.nurse_id, r.plan_date, r.plan_time, r.status, r.created_at])
    ), req.path);
    res.send(html);
});

module.exports = router;
