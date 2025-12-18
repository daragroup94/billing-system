const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Generate payment ID
const generatePaymentId = () => {
  return `PAY-${Date.now()}`;
};

// Get all payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as customer, i.id as invoice_number
      FROM payments p
      LEFT JOIN customers c ON p.customer_id = c.id
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE (p.id ILIKE $1 OR c.name ILIKE $1)
    `;
    const params = [`%${search}%`];

    if (status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    const countQuery = `
      SELECT COUNT(*) FROM payments p
      LEFT JOIN customers c ON p.customer_id = c.id
      WHERE (p.id ILIKE $1 OR c.name ILIKE $1)
      ${status ? 'AND p.status = $2' : ''}
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
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create payment
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { invoice_id, customer_id, amount, method, notes } = req.body;
    const id = generatePaymentId();

    // Create payment
    const paymentResult = await client.query(
      `INSERT INTO payments (id, invoice_id, customer_id, amount, method, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, invoice_id, customer_id, amount, method, notes]
    );

    // Update invoice status to paid
    await client.query(
      `UPDATE invoices SET status = 'paid', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [invoice_id]
    );

    await client.query('COMMIT');

    const io = req.app.get('io');
    io.emit('payment_created', paymentResult.rows[0]);

    res.status(201).json(paymentResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Delete payment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM payments WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const io = req.app.get('io');
    io.emit('payment_deleted', { id: req.params.id });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
