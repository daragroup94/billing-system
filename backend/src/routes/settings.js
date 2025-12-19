// backend/src/routes/settings.js

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// --- PERBAIKAN HANDLER GET ---
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Ambil data dari tabel 'settings'
    const settingsResult = await pool.query('SELECT * FROM settings');
    const settings = settingsResult.rows;

    // Ambil data dari tabel 'company_profile'
    const profileResult = await pool.query('SELECT * FROM company_profile LIMIT 1');
    const profile = profileResult.rows[0]; // Ambil baris pertama

    // Gabungkan kedua data tersebut
    // Data dari company_profile diubah formatnya agar mirip dengan settings
    const combinedData = [
      ...settings,
      { key: 'company_name', value: profile.company_name || '', description: 'Nama perusahaan' },
      { key: 'email', value: profile.email || '', description: 'Email bisnis' },
      { key: 'phone', value: profile.phone || '', description: 'Nomor telepon' },
      { key: 'website', value: profile.website || '', description: 'Website' },
      { key: 'address', value: profile.address || '', description: 'Alamat' },
    ];

    res.json(combinedData);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- PERBAIKAN HANDLER PUT ---
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    const key = req.params.key;

    // Daftar key yang berasal dari tabel company_profile
    const profileKeys = ['company_name', 'email', 'phone', 'website', 'address'];

    if (profileKeys.includes(key)) {
      // Update data di tabel company_profile
      const query = `UPDATE company_profile SET ${key} = $1, updated_at = CURRENT_TIMESTAMP RETURNING *`;
      const result = await pool.query(query, [value]);
      res.json(result.rows[0]);

    } else {
      // Update data di tabel settings (logika lama)
      const result = await pool.query(
        `UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP
         WHERE key = $2 RETURNING *`,
        [value, key]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Setting not found' });
      }

      res.json(result.rows[0]);
    }

  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
