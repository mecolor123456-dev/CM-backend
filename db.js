import pkg from 'pg';
const { Pool } = pkg;

// 👇 PEGA AQUÍ TU URL DE RENDER
const pool = new Pool({
  connectionString: "postgresql://cafeteria_db_3wy0_user:eGXXbYcJn47Go7jRuSnRU9H9Hiz7bFZe@dpg-d3suuqfdiees73csljog-a.oregon-postgres.render.com/cafeteria_db_3wy0",
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
