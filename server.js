import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar producto
app.post("/api/productos", async (req, res) => {
  try {
    const { nombre, precio, categoria, personalizaciones, imagen } = req.body;
    const result = await pool.query(
      "INSERT INTO productos (nombre, precio, categoria, personalizaciones, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, precio, categoria, JSON.stringify(personalizaciones), imagen]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Editar producto
app.put("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, personalizaciones, imagen } = req.body;
    const result = await pool.query(
      "UPDATE productos SET nombre=$1, precio=$2, categoria=$3, personalizaciones=$4, imagen=$5 WHERE id=$6 RETURNING *",
      [nombre, precio, categoria, JSON.stringify(personalizaciones), imagen, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar producto" });
  }
});

// Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM productos WHERE id=$1", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// ==================== SERVIDOR ====================

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Servidor backend corriendo en puerto ${PORT}`));
