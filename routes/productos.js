const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

let productos = []; // temporal, puedes reemplazar con DB

// GET productos
router.get('/', (req, res) => res.json(productos));

// POST producto
router.post('/', (req, res) => {
  const producto = { id: Date.now(), ...req.body };
  productos.push(producto);
  res.json(producto);
});

// PUT editar producto
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...req.body };
    res.json(productos[index]);
  } else res.status(404).json({ error: 'Producto no encontrado' });
});

// DELETE producto
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  productos = productos.filter(p => p.id !== id);
  res.json({ msg: 'Producto eliminado' });
});

// POST subir imagen
router.post('/upload', upload.single('imagen'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
