import express from "express";
import cors from "cors";
import pool from "./db.js"; // tu conexión a PostgreSQL
import productosRoutes from "./routes/productos.js";
import usuariosRoutes from "./routes/usuarios.js";
import reportesRoutes from "./routes/reportes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors()); // importante para conectar frontend
app.use(express.json());
app.use("/uploads", express.static("uploads")); // si usas imágenes

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/reportes", reportesRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
