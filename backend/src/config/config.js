const dotenv = require('dotenv');
const path = require('path');

class Config {
    constructor() {
        if (!Config.instance) {
            this.data = {};
            this.load();
            Config.instance = this;
        }
        return Config.instance;
    }

    load() {
        // '../' goes to src, '../../../' goes to the root folder
        const envPath = path.join(__dirname, '../../../.env');
        const result = dotenv.config({ path: envPath });

        if (result.error) {
            console.warn("⚠️ Could not find .env file at " + envPath);
        }

        this.data = { ...process.env };
    }

    get(key) {
        return this.data[key];
    }
}

const instance = new Config();
Object.freeze(instance);

module.exports = instance;