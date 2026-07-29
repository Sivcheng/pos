const express = require("express");
const { Pool } = require("pg");
require("dotenv").config(); // សម្រាប់អាន .env លើ local

const app = express();
app.use(express.json());

// ១. ការបង្កើត Connection Pool ទៅកាន់ Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ចាំបាច់បំផុតសម្រាប់ Cloud Database ដូចជា Neon/Supabase
  },
});

// ២. Test Route សម្រាប់ពិនិត្យការតភ្ជាប់ Database
app.get("/api/test-db", async (req, res) => {
  try {
    // សាកល្បង Query ទាញយកម៉ោងបច្ចុប្បន្នចេញពី PostgreSQL
    const result = await pool.query(
      "SELECT NOW() as current_time, version() as db_version",
    );

    res.json({
      success: true,
      message: "✅ ភ្ជាប់ទៅកាន់ Database បានជោគជ័យ!",
      timestamp: result.rows[0].current_time,
      postgresVersion: result.rows[0].db_version,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      success: false,
      message: "❌ មិនអាចភ្ជាប់ទៅកាន់ Database បានទេ!",
      error: error.message,
    });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Express POS API is running...");
});

// សម្រាប់ Local Development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
