const express = require('express');
const config = require('../config/config');
const authRoutes = require('./http/routes/authRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const startServer = () => {
    const PORT = config.get('PORT') || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 GatePass360 Backend running on port ${PORT}`);
    });
};

module.exports = { startServer };