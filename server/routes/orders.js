const express = require('express');
const router = express.Router();
const { get, all, run } = require('../config/database');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/list', requireAuth, (req, res) => {
    try {
        const { page = 1, pageSize = 10, status } = req.query;
        const offset = (page - 1) * pageSize;

        let sql = `
            SELECT o.*, e.name as elderly_name, e.address, e.phone as elderly_phone,
                   d.name as doctor_name, d.phone as doctor_phone
            FROM orders o
            LEFT JOIN elderly e ON o.elderly_id = e.id
            LEFT JOIN doctors d ON o.doctor_id = d.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            sql += ' AND o.status = ?';
            params.push(status);
        }

        const countSql = sql.replace('SELECT o.*', 'SELECT COUNT(*) as total');
        const countResult = get(countSql, params);
        const total = countResult.total;

        sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(pageSize), parseInt(offset));

        const orders = all(sql, params);

        res.json({
            success: true,
            data: {
                list: orders,
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            }
        });

    } catch (error) {
        console.error('获取工单列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

router.post('/create', requireAuth, (req, res) => {
    try {
        const orderData = req.body;
        console.log('收到创建工单请求:', orderData);
        
        const orderNo = 'ORD' + Date.now();

        const result = run(
            `INSERT INTO orders (order_no, elderly_id, alert_id, doctor_id, urgency, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                orderNo,
                orderData.elderly_id,
                orderData.alert_id || null,
                orderData.doctor_id,
                orderData.urgency || '一般',
                orderData.description
            ]
        );

        console.log('工单创建成功:', { id: result.lastInsertRowid, order_no: orderNo });

        res.json({
            success: true,
            message: '工单创建成功',
            data: { id: result.lastInsertRowid, order_no: orderNo }
        });

    } catch (error) {
        console.error('创建工单错误:', error);
        console.error('错误堆栈:', error.stack);
        res.status(500).json({
            success: false,
            message: '服务器错误: ' + error.message
        });
    }
});

router.put('/:id/status', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let sql = 'UPDATE orders SET status = ?';
        const params = [status];

        if (status === '已接单') {
            sql += ", accept_time = datetime('now', 'localtime')";
        } else if (status === '已到达') {
            sql += ", arrive_time = datetime('now', 'localtime')";
        } else if (status === '已完成') {
            sql += ", complete_time = datetime('now', 'localtime')";
        }

        sql += ' WHERE id = ?';
        params.push(id);

        run(sql, params);

        res.json({
            success: true,
            message: '状态更新成功'
        });

    } catch (error) {
        console.error('更新工单状态错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

router.put('/:id/complete', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        const { result } = req.body;

        run(
            `UPDATE orders SET status = '已完成', complete_time = datetime('now', 'localtime'), result = ? WHERE id = ?`,
            [result, id]
        );

        res.json({
            success: true,
            message: '工单完成'
        });

    } catch (error) {
        console.error('完成工单错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;
