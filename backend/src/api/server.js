const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');
const authRoutes = require('./http/routes/authRoutes');

const app = express();

app.use(cors());

app.use(express.json());

const frontendPath = path.join(__dirname, '../../../frontend');
app.use(express.static(frontendPath));

//Root Redirect
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/index.html'));
});


// Routes
app.use('/api/auth', authRoutes);

const startServer = () => {
    const PORT = config.get('PORT') || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 GatePass360 Backend running on port ${PORT}`);
    });
};

module.exports = { startServer };