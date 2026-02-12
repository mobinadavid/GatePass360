const passService = require('../../../../services/passService');
const passRepository = require('../../../../repositories/passRepository');
const visitRepository=require('../../../../repositories/visitRepository');
const ResponseBuilder = require('../../response/ResponseBuilder');
const { Op } = require('sequelize');

class PassController {

    async issue(req, res) {
        try {
            const { visit_id } = req.body;
            if (!visit_id) throw new Error('visit_id is required');

            await passService.issuePermit(visit_id, req.user.id);

            return ResponseBuilder.api(req, res)
                .setStatusCode(201)
                .setMessage('Permit issued successfully')
                .send();
        } catch (e) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(400)
                .setMessage(e.message)
                .send();
        }
    }

    async checkIn(req, res) {
        try {
            await passService.checkIn(req.body.pass_code);
            return ResponseBuilder.api(req, res).setStatusCode(200).setMessage('Entry recorded').send();
        } catch (e) {
            return ResponseBuilder.api(req, res).setStatusCode(400).setMessage(e.message).send();
        }
    }

    async checkOut(req, res) {
        try {
            await passService.checkOut(req.body.pass_code);
            return ResponseBuilder.api(req, res).setStatusCode(200).setMessage('Exit recorded').send();
        } catch (e) {
            return ResponseBuilder.api(req, res).setStatusCode(400).setMessage(e.message).send();
        }
    }

    async present(req, res) {
        const list = await passRepository.getPresent();
        return ResponseBuilder.api(req, res).setStatusCode(200)
            .setMessage("listed successfully").setData({ present_visitors: list }).send();
    }

    async index(req, res) {
        const passes = await passRepository.getAll(req.passFilter);

        return ResponseBuilder.api(req, res)
            .setData({ passes })
            .setStatusCode(200)
            .setMessage("listed successfully")
            .send();
    }

    async getDashboardStats(req, res) {
        const stats = await visitRepository.getStats();
        const presentCount = await passRepository.getAll({
            check_in_time: { [Op.ne]: null },
            check_out_time: null
        });

        return ResponseBuilder.api(req, res).setData({
            weekly_stats: stats,
            currently_present: presentCount.length
        }).setStatusCode(200).setMessage("").send();
    }
}

module.exports = new PassController();