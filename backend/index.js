// backend/index.js
const bootstrap = require('./src/bootstrap');

// Initialize the app
bootstrap.init().catch(err => {
    console.error('💥 Failed to start application:', err);
    process.exit(1);
});