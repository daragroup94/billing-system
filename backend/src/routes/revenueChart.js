// backend/src/routes/revenueChart.js

const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const revenueQuery = `
      SELECT
        TO_CHAR(payment_date, 'Mon') as month,
        EXTRACT(MONTH FROM payment_date) as month_num,
        COALESCE(SUM(amount), 0) as total_revenue
      FROM payments
      WHERE EXTRACT(YEAR FROM payment_date) = $1
      GROUP BY month, month_num
      ORDER BY month_num;
    `;

    const revenueResult = await pool.query(revenueQuery, [currentYear]);

    // --- PERBAIKAN: Ubah monthMap ke bahasa Inggris ---
    const mapToMonthlyArray = (data, key) => {
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, // <-- 'May' bukan 'Mei'
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11  // <-- 'Aug', 'Oct', 'Dec' bukan 'Agu', 'Okt', 'Des'
      };
      const arr = Array(12).fill(0);
      data.forEach(item => {
        const index = monthMap[item.month];
        if (index !== undefined) {
          arr[index] = item[key];
        }
      });
      return arr;
    };

    const monthlyRevenue = mapToMonthlyArray(revenueResult.rows, 'total_revenue');

    res.json({
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Juga perbarui label bulan
      revenue: monthlyRevenue,
    });

  } catch (error) {
    console.error('Error fetching revenue chart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
