const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/products -> product list, each with its variants nested
router.get('/', async (req, res) => {
  try {
    const products = await pool.query(
      `SELECT * FROM products WHERE is_active = TRUE ORDER BY id`
    );
    const variants = await pool.query(
      `SELECT * FROM product_variants WHERE is_active = TRUE ORDER BY id`
    );

    const result = products.rows.map((p) => ({
      ...p,
      variants: variants.rows.filter((v) => v.product_id === p.id),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'មិនអាចទាញយកទិន្នន័យផលិតផលបានទេ' });
  }
});

// POST /api/products -> create a new product (admin use)
router.post('/', async (req, res) => {
  const { code, name_kh, type, unit, has_shape, variants } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const productRes = await client.query(
      `INSERT INTO products (code, name_kh, type, unit, has_shape)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [code, name_kh, type, unit || 'ដុំ', !!has_shape]
    );
    const product = productRes.rows[0];

    if (type === 'variant' && Array.isArray(variants)) {
      for (const v of variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, label, shape, price)
           VALUES ($1,$2,$3,$4)`,
          [product.id, v.label, v.shape || null, v.price]
        );
      }
    }
    await client.query('COMMIT');
    res.status(201).json(product);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'មិនអាចបង្កើតផលិតផលបានទេ' });
  } finally {
    client.release();
  }
});

module.exports = router;
