// backend/src/routes/settings.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    res.json(result.rows);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    const result = await pool.query(
      `UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP
       WHERE key = $2 RETURNING *`,
      [value, req.params.key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
