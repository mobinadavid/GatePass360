const { Pool } = require('pg');
const config = require('../config/config');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = new Pool({
                user: config.get('DB_USER'),
                host: config.get('DB_HOST'),
                database: config.get('DB_NAME'),
                password: config.get('DB_PASSWORD'),
                port: config.get('DB_PORT'),
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    async query(text, params) {
        return this.pool.query(text, params);
    }

    async close() {
        await this.pool.end();
        console.log("Database Service: Disconnected Successfully.");
    }
}

const instance = new Database();
Object.freeze(instance);
module.exports = instance;