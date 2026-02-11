const jwt = require('jsonwebtoken');
const config = require('../config/config');

class JwtService {
    constructor() {
        this.secret = config.get('JWT_SECRET');
    }

    generateToken(payload) {
        // Generates a token valid for 8 hours as per project standard
        const lifetime = parseInt(config.get('JWT_ACCESS_TOKEN_LIFETIME')) || 3600;
        return jwt.sign(payload, this.secret, { expiresIn: lifetime});
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new JwtService();