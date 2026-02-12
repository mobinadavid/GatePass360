const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');
const authRoutes = require('./http/routes/authRoutes');
const visitRoutes=require('./http/routes/visitRoutes');
const userRoutes=require('./http/routes/userRoutes');
const app = express();

app.use(cors());

app.use(express.json());

const frontendPath = path.join(__dirname, '../../../frontend');
app.use(express.static(frontendPath));

//Root Redirect
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/dashboard.html'));
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes)
app.use('/api/users', userRoutes)

const startServer = () => {
    const PORT = config.get('PORT') || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 GatePass360 Backend running on port ${PORT}`);
    });
};

module.exports = { startServer };