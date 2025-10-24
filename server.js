import express from "express";
import cors from "cors";
import pool from "./db.js";
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";
import reportesRoutes from "./routes/reportes.js";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Carpeta para imágenes
app.use("/uploads", express.static("uploads"));

// Configuración de multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/reportes", reportesRoutes);

// Endpoint para subir imagen de producto
app.post("/api/productos/upload", upload.single("imagen"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió archivo" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

