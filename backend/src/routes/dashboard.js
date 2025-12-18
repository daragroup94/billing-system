// backend/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM customers WHERE status = $1', ['active']),
      pool.query(`SELECT COALESCE(SUM(amount), 0) as total 
                  FROM payments 
                  WHERE EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                  AND status = 'success'`),
      pool.query('SELECT COUNT(*) as total FROM invoices WHERE status = $1', ['pending']),
      pool.query('SELECT COUNT(*) as total FROM invoices WHERE due_date = CURRENT_DATE AND status = $1', ['pending'])
    ]);

    res.json({
      totalCustomers: parseInt(stats[0].rows[0].total),
      monthlyRevenue: parseFloat(stats[1].rows[0].total),
      pendingInvoices: parseInt(stats[2].rows[0].total),
      dueTodayInvoices: parseInt(stats[3].rows[0].total)
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
