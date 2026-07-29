const express = require('express');
const router = express.Router();
const pool = require('../db');

// Generate a simple sequential invoice number: INV-20260727-0001
async function generateInvoiceNo(client) {
  const today = new Date();
  const ymd = today.toISOString().slice(0, 10).replace(/-/g, '');
  const { rows } = await client.query(
    `SELECT COUNT(*)::int AS cnt FROM orders WHERE invoice_no LIKE $1`,
    [`INV-${ymd}-%`]
  );
  const seq = String(rows[0].cnt + 1).padStart(4, '0');
  return `INV-${ymd}-${seq}`;
}

// POST /api/orders -> create a new invoice/receipt
router.post('/', async (req, res) => {
  const {
    customer_name,
    customer_phone,
    discount = 0,
    paid = 0,
    payment_method = 'CASH',
    cashier,
    items, // [{ product_id, description, length_m, width_m, thickness, unit_price, quantity }]
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'គ្មានទំនិញក្នុងបញ្ជីទិញទេ' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const invoice_no = await generateInvoiceNo(client);

    const subtotal = items.reduce(
      (sum, it) => sum + Number(it.unit_price) * Number(it.quantity || 1),
      0
    );
    const total = Math.max(subtotal - Number(discount || 0), 0);
    const change_due = Math.max(Number(paid || 0) - total, 0);

    const orderRes = await client.query(
      `INSERT INTO orders
        (invoice_no, customer_name, customer_phone, subtotal, discount, total, paid, change_due, payment_method, cashier)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        invoice_no,
        customer_name || 'អតិថិជនទូទៅ',
        customer_phone || null,
        subtotal,
        discount || 0,
        total,
        paid || 0,
        change_due,
        payment_method,
        cashier || null,
      ]
    );
    const order = orderRes.rows[0];

    const insertedItems = [];
    for (const it of items) {
      const line_total = Number(it.unit_price) * Number(it.quantity || 1);
      const itemRes = await client.query(
        `INSERT INTO order_items
          (order_id, product_id, description, length_m, width_m, thickness, unit_price, quantity, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          order.id,
          it.product_id || null,
          it.description,
          it.length_m || null,
          it.width_m || null,
          it.thickness || null,
          it.unit_price,
          it.quantity || 1,
          line_total,
        ]
      );
      insertedItems.push(itemRes.rows[0]);
    }

    await client.query('COMMIT');
    res.status(201).json({ ...order, items: insertedItems });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'មិនអាចបង្កើតវិក្កយបត្របានទេ' });
  } finally {
    client.release();
  }
});

// GET /api/orders -> list invoices (most recent first)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT 200`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'មិនអាចទាញយកបញ្ជីវិក្កយបត្របានទេ' });
  }
});

// GET /api/orders/:id -> full invoice with items
router.get('/:id', async (req, res) => {
  try {
    const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
      req.params.id,
    ]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'រកមិនឃើញវិក្កយបត្រនេះទេ' });
    }
    const itemsRes = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id`,
      [req.params.id]
    );
    res.json({ ...orderRes.rows[0], items: itemsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'មិនអាចទាញយកវិក្កយបត្របានទេ' });
  }
});

module.exports = router;
