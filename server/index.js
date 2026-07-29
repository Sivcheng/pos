const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`POS server ដំណើរការនៅ port ${PORT}`);
});
