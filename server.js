import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 10000;

// Obtener ruta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// 🧁 Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ==========================
//   🧩 RUTAS DEL SISTEMA
// ==========================

// 📦 Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  const result = await pool.query("SELECT * FROM productos ORDER BY categoria, nombre");
  res.json(result.rows);
});

// ➕ Agregar producto
app.post("/api/productos", upload.single("imagen"), async (req, res) => {
  const { nombre, precio, categoria, personalizaciones } = req.body;
  const imagen = req.file ? req.file.filename : null;

  await pool.query(
    "INSERT INTO productos (nombre, precio, categoria, imagen, personalizaciones) VALUES ($1, $2, $3, $4, $5)",
    [nombre, precio, categoria, imagen, personalizaciones]
  );
  res.json({ mensaje: "Producto agregado correctamente" });
});

// ✏️ Editar producto
app.put("/api/productos/:id", upload.single("imagen"), async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria, personalizaciones } = req.body;
  const imagen = req.file ? req.file.filename : null;

  await pool.query(
    "UPDATE productos SET nombre=$1, precio=$2, categoria=$3, imagen=COALESCE($4, imagen), personalizaciones=$5 WHERE id=$6",
    [nombre, precio, categoria, imagen, personalizaciones, id]
  );
  res.json({ mensaje: "Producto actualizado" });
});

// 🗑️ Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM productos WHERE id=$1", [id]);
  res.json({ mensaje: "Producto eliminado" });
});

// 🧾 Registrar venta
app.post("/api/ventas", async (req, res) => {
  const { cliente, total, fecha, detalle } = req.body;
  await pool.query(
    "INSERT INTO ventas (cliente, total, fecha, detalle) VALUES ($1, $2, $3, $4)",
    [cliente, total, fecha, detalle]
  );
  res.json({ mensaje: "Venta registrada" });
});

// 📊 Reporte semanal y mensual
app.get("/api/reporte", async (req, res) => {
  const { tipo } = req.query;
  let rango = "7 days";
  if (tipo === "mensual") rango = "30 days";
  const result = await pool.query(
    `SELECT * FROM ventas WHERE fecha >= NOW() - INTERVAL '${rango}' ORDER BY fecha DESC`
  );
  res.json(result.rows);
});

// ==========================
//   🧠 TABLAS INICIALES
// ==========================
async function crearTablas() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      precio NUMERIC,
      categoria VARCHAR(50),
      imagen TEXT,
      personalizaciones TEXT
    );

    CREATE TABLE IF NOT EXISTS ventas (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(100),
      total NUMERIC,
      fecha TIMESTAMP,
      detalle TEXT
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      password VARCHAR(100),
      rol VARCHAR(20)
    );
  `);
  console.log("✅ Tablas verificadas/creadas correctamente");
}

crearTablas();

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});