const authorizationService = require('../../../services/authorizationService');
const ResponseBuilder = require('../response/ResponseBuilder');

const can = (permission) => {
    return async (req, res, next) => {
        try {
            // req.user.id was set by the authenticate middleware
            const isAuthorized = await authorizationService.isAuthorized(req.user.id, permission);

            if (!isAuthorized) {
                return ResponseBuilder.api(req, res)
                    .setStatusCode(403)
                    .setMessage('request-unauthorized')
                    .setLog()
                    .send();
            }

            next();
        } catch (error) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(403)
                .setMessage('Authorization check failed')
                .send();
        }
    };
};

module.exports = { can };