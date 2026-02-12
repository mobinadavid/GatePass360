const visitRepository = require('../repositories/visitRepository');
const userRepository = require('../repositories/userRepository');
class VisitService {
    async requestVisit(guestId, data) {
        // Validation: Check if the target host_id actually has the 'host' role [cite: 199, 225]
        const isValidHost = await userRepository.hasRole(data.host_id, 'host');

        if (!isValidHost) {
            throw new Error('The selected user is not a valid Host');
        }

        return await visitRepository.create({
            visitor_id: guestId,
            host_id: data.host_id,
            purpose: data.purpose,
            visit_date: data.visit_date,
            status: 'pending_host'
        });
    }

    async getGuestVisits(guestId) {
        return await visitRepository.getByGuestId(guestId);
    }

    async getHostPendingVisits(hostId) {
        return await visitRepository.getByHostId(hostId);
    }

    async approveVisit(visitId, hostId) {
        const visit = await visitRepository.findById(visitId);
        if (!visit || visit.host_id !== parseInt(hostId)) {
            throw new Error('Visit not found or unauthorized');
        }
        return await visitRepository.updateStatus(visitId, 'approved_by_host', hostId);
    }

    async rejectVisit(visitId, hostId, reason) {
        const visit = await visitRepository.findById(visitId);
        if (!visit || visit.host_id !== hostId) throw new Error('Visit not found or unauthorized');

        return await visitRepository.updateStatus(visitId, 'rejected', hostId, reason);
    }

    async getFilteredVisits(filters) {
        return await visitRepository.getAllWithFilters(filters);
    }

    async getApprovedByHosts(filters) {
        return await visitRepository.getAllWithFilters({
            ...filters,
            status: 'approved_by_host'
        });
    }

    async getVisitDetails(visitId) {
        return await visitRepository.findById(visitId);
    }

    async getDashboardStats() {
        return await visitRepository.getStats();
    }

    async getAllVisits(filters) {
        return await visitRepository.getAllWithFilters(filters);
    }
}

module.exports = new VisitService();