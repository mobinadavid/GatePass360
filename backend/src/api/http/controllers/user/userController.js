const userService = require('../../../../services/userService');
const ResponseBuilder = require('../../response/ResponseBuilder');
const userRepository = require('../../../../repositories/userRepository');

class UserController {
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
    async listHosts(req, res) {
        try {
            const hosts = await userRepository.findUsersByRole('host');

            return ResponseBuilder.api(req, res)
                .setStatusCode(200)
                .setMessage('Hosts list retrieved')
                .setData({ hosts })
                .send();
        } catch (error) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(500)
                .setMessage(error.message)
                .send();
        }
    }
}

module.exports = new UserController();