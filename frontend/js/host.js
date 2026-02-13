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

async function loadHostLogs() {
    const tbody = document.getElementById('hostLogsList');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

    const res = await apiRequest('/visits/host');

    console.log("VISITS RESPONSE:", res);
    if (!res?.is_successful) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-danger">
                    ${res?.message || 'Failed to load logs'}
                </td>
            </tr>`;
        return;
    }
    let visits = [];
    if (Array.isArray(res.data?.visits)) {
        visits = res.data.visits;
    } else if (Array.isArray(res.data)) {
        visits = res.data;
    }

    if (!visits.length) {
        tbody.innerHTML = `<tr><td colspan="4">No logs found</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    visits.forEach(v => {
        let badge = 'badge-secondary';
        if (v.status?.includes('REJECT')) badge = 'badge-danger';
        else if (v.status?.includes('APPROVED')) badge = 'badge-success';
        else if (v.status?.includes('PENDING')) badge = 'badge-warning';
        let details = '---';

        if (v.rejection_reason) {
            details = `<span class="text-danger">Reason: ${v.rejection_reason}</span>`;
        } 
        else if (v.Pass?.pass_code) {
            details = `<span class="text-info">Pass: ${v.Pass.pass_code}</span>`;
        }

        const row = document.createElement('tr');

        row.innerHTML = `
            <td><strong>${v.Visitor?.full_name || v.Guest?.full_name || 'Visitor'}</strong></td>
            <td>${v.visit_date || '-'}</td>
            <td><span class="badge ${badge}">
                ${(v.status || '').replace(/_/g,' ')}
            </span></td>
            <td>${details}</td>
        `;

        tbody.appendChild(row);
    });
}


