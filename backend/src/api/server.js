const express = require('express');
const config = require('../config/config');
const authRoutes = require('./http/routes/authRoutes');
const visitRoutes=require('./http/routes/visitRoutes');
const userRoutes=require('./http/routes/userRoutes');
const passRoutes = require('./http/routes/passRoutes');
const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes)
app.use('/api/users', userRoutes)
app.use('/api/passes', passRoutes);

const startServer = () => {
    const PORT = config.get('PORT') || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 GatePass360 Backend running on port ${PORT}`);
    });
};

module.exports = { startServer };