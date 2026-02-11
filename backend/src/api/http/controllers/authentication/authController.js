const userService = require('../../../../services/userService');
const ResponseBuilder = require('../../response/ResponseBuilder');

class AuthController {
    async register(req, res) {
        try {
            const user = await userService.registerUser(req.body);

            return ResponseBuilder.api(req, res)
                .setStatusCode(201)
                .setMessage('Registration successful')
                .setData({ user: user })
                .send();
        } catch (error) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(400)
                .setMessage(error.message)
                .send();
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Handing off all logic to the Service [cite: 8, 31]
            const result = await userService.login(username, password);

            return ResponseBuilder.api(req, res)
                .setStatusCode(200)
                .setMessage('Login successful')
                .setData(result)
                .send();
        } catch (error) {
            // Distinguish between Auth errors (401) and Server errors (500)
            const statusCode = error.message === 'Invalid credentials' ? 401 : 500;

            return ResponseBuilder.api(req, res)
                .setStatusCode(statusCode)
                .setMessage(error.message)
                .send();
        }
    }

    async logout(req, res) {
        // Since JWT is stateless, logout is usually handled by client
        // by deleting the token. We return success. [cite: 252]
        return ResponseBuilder.api(req, res)
            .setStatusCode(200)
            .setMessage('Logged out successfully')
            .send();
    }
}

module.exports = new AuthController();