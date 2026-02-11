const jwtService = require('../../../services/jwtService');
const ResponseBuilder = require('../response/ResponseBuilder');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseBuilder.api(req, res)
            .setStatusCode(401)
            .setMessage('Unauthorized: No token provided')
            .send();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
        return ResponseBuilder.api(req, res)
            .setStatusCode(401)
            .setMessage('Unauthorized: Invalid or expired token')
            .send();
    }

    req.user = decoded; // Attach user payload to request
    next();
};

module.exports = { authenticate };