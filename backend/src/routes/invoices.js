const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Generate invoice ID
const generateInvoiceId = async () => {
  const result = await pool.query(
    "SELECT value FROM settings WHERE key = 'invoice_prefix'"
  );
  const prefix = result.rows[0]?.value || 'INV-';
  const timestamp = Date.now();
  return `${prefix}${timestamp}`;
};

// Get all invoices
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.*, c.name as customer, p.name as package
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN packages p ON i.package_id = p.id
      WHERE (i.id ILIKE $1 OR c.name ILIKE $1)
    `;
    const params = [`%${search}%`];

    if (status) {
      query += ` AND i.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    const countQuery = `
      SELECT COUNT(*) FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      WHERE (i.id ILIKE $1 OR c.name ILIKE $1)
      ${status ? 'AND i.status = $2' : ''}
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
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create invoice
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customer_id, package_id, amount, due_date, notes } = req.body;
    const id = await generateInvoiceId();

    const result = await pool.query(
      `INSERT INTO invoices (id, customer_id, package_id, amount, due_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, customer_id, package_id, amount, due_date, notes]
    );

    const io = req.app.get('io');
    io.emit('invoice_created', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update invoice
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE invoices SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [status, notes, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const io = req.app.get('io');
    io.emit('invoice_updated', result.rows[0]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete invoice
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const io = req.app.get('io');
    io.emit('invoice_deleted', { id: req.params.id });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
