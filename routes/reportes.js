import express from "express";
import pool from "../db.js";

const router = express.Router();

// Reporte semanal
router.get("/semanal", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ventas
      WHERE fecha >= NOW() - INTERVAL '7 days'
      ORDER BY fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reporte semanal" });
  }
});

// Reporte mensual
router.get("/mensual", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ventas
      WHERE fecha >= date_trunc('month', CURRENT_DATE)
      ORDER BY fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reporte mensual" });
  }
});

export default router;
