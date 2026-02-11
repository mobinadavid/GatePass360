const userService = require('../../../../services/userService');
const ResponseBuilder = require('../../response/ResponseBuilder');

class ProfileController {
    async me(req, res) {
        try {
            const user = await userService.getProfile(req.user.id);

            return ResponseBuilder.api(req, res)
                .setStatusCode(200)
                .setMessage('User profile retrieved')
                .setData({
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    roles: user.Roles.map(r => r.name),
                    permissions: [...new Set(user.Roles.flatMap(r => r.Permissions.map(p => p.slug)))]
                })
                .send();
        } catch (error) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(404)
                .setMessage(error.message)
                .send();
        }
    }
}

module.exports = new ProfileController();