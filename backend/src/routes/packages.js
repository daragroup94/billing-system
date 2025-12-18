const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all packages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, COUNT(c.id) as subscribers
       FROM packages p
       LEFT JOIN customers c ON p.id = c.package_id
       GROUP BY p.id
       ORDER BY p.price ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get package by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, COUNT(c.id) as subscribers
       FROM packages p
       LEFT JOIN customers c ON p.id = c.package_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create package
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, speed, price, description, features, is_popular } = req.body;

    const result = await pool.query(
      `INSERT INTO packages (name, speed, price, description, features, is_popular)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, speed, price, description, JSON.stringify(features), is_popular]
    );

    const io = req.app.get('io');
    io.emit('package_created', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update package
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, speed, price, description, features, is_popular, is_active } = req.body;

    const result = await pool.query(
      `UPDATE packages 
       SET name = $1, speed = $2, price = $3, description = $4, 
           features = $5, is_popular = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [name, speed, price, description, JSON.stringify(features), is_popular, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const io = req.app.get('io');
    io.emit('package_updated', result.rows[0]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete package
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM packages WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const io = req.app.get('io');
    io.emit('package_deleted', { id: req.params.id });

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
