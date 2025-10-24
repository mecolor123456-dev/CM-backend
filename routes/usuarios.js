import express from "express";
import pool from "../db.js";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND contrasena = $2",
      [usuario, contrasena]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
