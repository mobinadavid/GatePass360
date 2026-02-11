const bcrypt = require('bcrypt');

class HashService {
    constructor() {
        this.driverName = process.env.HASH_DRIVER || 'bcrypt';
    }

    async generate(password) {
        if (this.driverName === 'bcrypt') {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
            const hash = await bcrypt.hash(password, saltRounds);
            // Format: driver:hash (matches your Go logic)
            return `${this.driverName}:${hash}`;
        }
        throw new Error(`Unsupported hash driver: ${this.driverName}`);
    }

    async verify(storedHash, inputPassword) {
        const [driver, hash] = storedHash.split(':');
        if (driver === 'bcrypt') {
            return await bcrypt.compare(inputPassword, hash);
        }
        throw new Error(`Unsupported hash driver: ${driver}`);
    }
}

module.exports = new HashService();