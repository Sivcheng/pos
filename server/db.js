const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ចាំបាច់សម្រាប់ភ្ជាប់ទៅ Cloud PostgreSQL
  },
});

module.exports = pool;
