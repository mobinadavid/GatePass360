const visitService = require('../../../../services/visitService');
const ResponseBuilder = require('../../response/ResponseBuilder');

class VisitController {
    async store(req, res) {
        try {
            const visit = await visitService.requestVisit(req.user.id, req.body);
            return ResponseBuilder.api(req, res).setStatusCode(201).setData({ visit }).send();
        } catch (e) {
            return ResponseBuilder.api(req, res).setStatusCode(400).setMessage(e.message).send();
        }
    }

    async listPendingSecurity(req, res) {
        const visits = await visitService.getApprovedByHosts(req.visitFilter);
        return ResponseBuilder.api(req, res).setMessage('')
            .setData({ visits }).send();
    }

    async myVisits(req, res) {
        const visits = await visitService.getGuestVisits(req.user.id);
        return ResponseBuilder.api(req, res).setStatusCode(200).setMessage("").setData({ visits }).send();
    }

    async hostVisits(req, res) {
        const filters = {
            ...req.visitFilter,
            host_id: req.user.id
        };
        const visits = await visitService.getFilteredVisits(filters);
        return ResponseBuilder.api(req, res).setStatusCode(200).setData({ visits }).send();
    }

    async approve(req, res) {
        try {
            const { id } = req.params;
            await visitService.approveVisit(id, req.user.id);

            return ResponseBuilder.api(req, res)
                .setStatusCode(200)
                .setMessage('Visit approved')
                .send();
        } catch (e) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(400)
                .setMessage(e.message)
                .send();
        }
    }

    async reject(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            if (!reason) {
                return ResponseBuilder.api(req, res)
                    .setStatusCode(400)
                    .setMessage('Rejection reason is required')
                    .send();
            }

            await visitService.rejectVisit(id, req.user.id, reason);

            return ResponseBuilder.api(req, res)
                .setStatusCode(200)
                .setMessage('Visit rejected successfully')
                .send();
        } catch (e) {
            return ResponseBuilder.api(req, res)
                .setStatusCode(400)
                .setMessage(e.message)
                .send();
        }
    }

    async index(req, res) {
        const visits = await visitService.getAllVisits(req.visitFilter);
        return ResponseBuilder.api(req, res).setStatusCode(200)
            .setMessage('listed successfully').setData({ visits }).send();
    }

    async show(req, res) {
        try {
            const visit = await visitService.getVisitDetails(req.params.id);
            if (!visit) throw new Error('Visit not found');
            return ResponseBuilder.api(req, res) .setStatusCode(200)
                .setMessage('listed successfully').setData({ visit }).send();
        } catch (e) {
            return ResponseBuilder.api(req, res).setStatusCode(404).setMessage(e.message).send();
        }
    }

    async getStats(req, res) {
        const stats = await visitService.getDashboardStats();
        return ResponseBuilder.api(req, res).setData({ stats }).send();
    }
}

module.exports = new VisitController();