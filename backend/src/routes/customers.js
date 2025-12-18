const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all customers with pagination and search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, p.name as package_name, p.speed as package_speed
      FROM customers c
      LEFT JOIN packages p ON c.package_id = p.id
      WHERE (c.name ILIKE $1 OR c.email ILIKE $1 OR c.phone ILIKE $1)
    `;
    const params = [`%${search}%`];

    if (status) {
      query += ` AND c.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countQuery = `
      SELECT COUNT(*) FROM customers c
      WHERE (c.name ILIKE $1 OR c.email ILIKE $1 OR c.phone ILIKE $1)
      ${status ? 'AND c.status = $2' : ''}
    `;
    const countParams = [`%${search}%`];
    if (status) countParams.push(status);
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, p.name as package_name, p.speed as package_speed, p.price as package_price
       FROM customers c
       LEFT JOIN packages p ON c.package_id = p.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create customer
router.post('/', authMiddleware, [
  body('name').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('package_id').isInt(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, package_id, status = 'active' } = req.body;

    // Get package price
    const packageResult = await pool.query('SELECT price FROM packages WHERE id = $1', [package_id]);
    if (packageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const monthly_fee = packageResult.rows[0].price;

    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, address, package_id, status, monthly_fee)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, email, phone, address, package_id, status, monthly_fee]
    );

    // Send real-time notification
    const io = req.app.get('io');
    io.emit('customer_created', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, address, package_id, status } = req.body;
    
    let query = 'UPDATE customers SET ';
    const params = [];
    const updates = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      params.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      params.push(phone);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      params.push(address);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      params.push(status);
    }
    if (package_id !== undefined) {
      updates.push(`package_id = $${paramCount++}`);
      params.push(package_id);
      
      // Update monthly fee
      const packageResult = await pool.query('SELECT price FROM packages WHERE id = $1', [package_id]);
      if (packageResult.rows.length > 0) {
        updates.push(`monthly_fee = $${paramCount++}`);
        params.push(packageResult.rows[0].price);
      }
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    query += updates.join(', ') + ` WHERE id = $${paramCount} RETURNING *`;
    params.push(req.params.id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Send real-time notification
    const io = req.app.get('io');
    io.emit('customer_updated', result.rows[0]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Send real-time notification
    const io = req.app.get('io');
    io.emit('customer_deleted', { id: req.params.id });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
