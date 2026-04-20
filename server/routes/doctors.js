const express = require('express');
const router = express.Router();
const { all, run } = require('../config/database');
const { requireAuth } = require('../middleware/auth');

router.get('/list', requireAuth, (req, res) => {
    try {
        const { status } = req.query;

        let sql = 'SELECT * FROM doctors WHERE 1=1';
        const params = [];

        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        sql += ' ORDER BY rating DESC';

        const doctors = all(sql, params);

        res.json({
            success: true,
            data: doctors
        });

    } catch (error) {
        console.error('获取医生列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

router.put('/:id/status', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        const { status, current_location } = req.body;

        let sql = 'UPDATE doctors SET status = ?';
        const params = [status];

        if (current_location) {
            sql += ', current_location = ?';
            params.push(current_location);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        run(sql, params);

        res.json({
            success: true,
            message: '医生状态更新成功'
        });

    } catch (error) {
        console.error('更新医生状态错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
});

module.exports = router;
