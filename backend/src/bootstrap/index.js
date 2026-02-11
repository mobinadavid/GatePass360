// src/bootstrap/index.js
const { startServer } = require('../api/server');
const db = require('../models');

class Bootstrap {
    async init() {
        console.log('⏳ Bootstrapping GatePass360...');

        // 1. Verify Database Connection
        try {
            await db.sequelize.authenticate();
            console.log('✅ Database connection established.');
        } catch (error) {
            throw new Error(`Database connection failed: ${error.message}`);
        }

        // 2. Start the HTTP Server
        startServer();
    }
}

module.exports = new Bootstrap();