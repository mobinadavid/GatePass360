async function loadHostPendingRequests() {
    const res = await apiRequest('/visits/host');
    const tbody = document.getElementById('hostRequestList');
    if (!tbody) return;

    if (res.data && res.data.visits) {
        const pendingVisits = res.data.visits.filter(v => 
            v.status === 'pending_host' || v.status === 'approved_by_host'
        );

        if (pendingVisits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No pending requests</td></tr>';
            return;
        }

        tbody.innerHTML = pendingVisits.map(v => `
            <tr>
                <td>${v.Guest?.full_name || v.Visitor?.full_name || 'Unknown'}</td>
                <td>${v.visit_date}</td>
                <td>${v.purpose}</td>
                <td>
                    <div class="btn-group">
                        ${v.status === 'pending_host' ? `
                            <button type="button" onclick="handleStatus(${v.id}, 'approved')" class="btn btn-sm btn-success mr-2">Confirm</button>
                            <button type="button" onclick="handleStatus(${v.id}, 'rejected')" class="btn btn-sm btn-danger">Reject</button>
                        ` : `<span class="badge badge-info">Waiting for Security</span>`}
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

window.handleStatus = async (id, status) => {
    let payload = {};
    if (status === 'rejected') {
        const reason = prompt("Please enter the reason for rejection:");
        if (reason === null) return;
        if (reason.trim() === "") { alert("Reason is required!"); return; }
        payload = { reason: reason };
    } else {
        if (!confirm("Are you sure you want to approve this visit?")) return;
    }

    const endpoint = status === 'approved' ? 'approve' : 'reject';
    const res = await apiRequest(`/visits/${id}/${endpoint}`, 'PATCH', payload);

    if (res.is_successful) {
        alert(`Visit ${status} successfully!`);
        loadHostPendingRequests();
        loadMyVisits();
    } else {
        alert("Error: " + (res.message || "Operation failed"));
    }
};
