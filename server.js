const express = require('express');
const cors = require('cors');
const path = require('path');
const productosRoutes = require('./routes/productos');

const app = express();
app.use(cors());
app.use(express.json()); // para recibir JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor backend corriendo en puerto ${PORT}`));


