const adminService = require('../../../../services/adminService');
const ResponseBuilder = require('../../response/ResponseBuilder');

class AdminController {
    async listUsers(req, res) {
        const users = await adminService.getUsersList();
        return ResponseBuilder.api(req, res).setStatusCode(200).setMessage("listed successfully").setData({ users }).send();
    }

    async listRoles(req, res) {
        const roles = await adminService.getRolesList();
        return ResponseBuilder.api(req, res).setStatusCode(200).setMessage("request successful").setData({ roles }).send();
    }

    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role_id } = req.body;
            await adminService.changeUserRole(id, role_id);
            return ResponseBuilder.api(req, res).setStatusCode(200).setMessage('User role updated').send();
        } catch (e) {
            return ResponseBuilder.api(req, res).setStatusCode(400).setMessage(e.message).send();
        }
    }

    async reports(req, res) {
        const reports = await adminService.getComprehensiveReport();
        return ResponseBuilder.api(req, res).setStatusCode(200).setMessage("request successful").setData({ reports }).send();
    }

}

module.exports = new AdminController();