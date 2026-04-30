require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Supaya server bisa baca data JSON
app.use(express.static('public')); // Melayani file statis (HTML/CSS/JS) dari folder public

// Gunakan Rute API
app.use('/api', apiRoutes);

// Jalur utama untuk landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`gasKerja.Ai running on http://localhost:${PORT}`);
});