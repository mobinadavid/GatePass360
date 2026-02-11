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

    async myVisits(req, res) {
        const visits = await visitService.getGuestVisits(req.user.id);
        return ResponseBuilder.api(req, res).setStatusCode(200).setMessage("").setData({ visits }).send();
    }

    async hostVisits(req, res) {
        const visits = await visitService.getHostPendingVisits(req.user.id);
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
}

module.exports = new VisitController();