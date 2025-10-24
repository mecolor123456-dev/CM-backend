import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render DATABASE_URL
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
