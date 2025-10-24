import express from "express";
import pool from "../db.js";
const router = express.Router();

// Obtener productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar producto
router.post("/", async (req, res) => {
  const { nombre, categoria, precio, personalizaciones, imagen } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre,categoria,precio,personalizaciones,imagen) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [nombre, categoria, precio, personalizaciones, imagen]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id=$1", [id]);
    res.json({ mensaje: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
