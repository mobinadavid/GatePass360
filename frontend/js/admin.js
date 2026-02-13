async function loadAdminUsers() {
    const res = await apiRequest('/admin/users');
    const tbody = document.getElementById('adminUserList');
    if (!tbody) return;

    if (res.is_successful && res.data.users) {
        tbody.innerHTML = res.data.users.map(user => `
            <tr>
                <td>${user.full_name}</td>
                <td>${user.username}</td>
                <td>${user.Roles.map(r => `<span class="badge badge-secondary">${r.name}</span>`).join(' ')}</td>
                <td>
                    <select class="form-control form-control-sm d-inline-block w-auto" onchange="changeUserRole(${user.id}, this.value)">
                        <option value="">Change Role...</option>
                        <option value="1">Guest</option>
                        <option value="2">Host</option>
                        <option value="3">Security</option>
                        <option value="4">Admin</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }
}

window.changeUserRole = async (userId, roleId) => {
    if (!roleId) return;
    if (!confirm("Are you sure you want to change this user's role?")) return;

    const res = await apiRequest(`/admin/users/${userId}/role`, 'PATCH', { role_id: parseInt(roleId) });
    
    if (res.is_successful) {
        alert("Role updated successfully!");
        loadAdminUsers();
    } else {
        alert(res.message || "Failed to update role");
    }
};

async function loadAdminReports() {
    const res = await apiRequest('/admin/reports');
    if (!res.is_successful || !res.data.reports) return;

    const { user_summary, visit_stats } = res.data.reports;
    if(document.getElementById('totalUsersCount')) 
        document.getElementById('totalUsersCount').innerText = user_summary.total_count;

    if(visit_stats.length > 0 && document.getElementById('todayVisitsCount'))
        document.getElementById('todayVisitsCount').innerText = visit_stats[0].visit_count;

    const reportBody = document.getElementById('adminVisitReportList');
    if (reportBody) {
        reportBody.innerHTML = visit_stats.map(stat => `
            <tr>
                <td>${stat.date}</td>
                <td><span class="badge badge-warning">${stat.visit_count} Visits</span></td>
            </tr>
        `).join('');
    }
}

async function loadAllVisitsForAdmin() {
    const res = await apiRequest('/visits'); 
    const tbody = document.getElementById('masterVisitList');
    if (!tbody) return;

    const visits = res.data?.visits || res.data || [];

    if (visits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No visit requests found.</td></tr>';
        return;
    }

    tbody.innerHTML = visits.map(v => {
        let statusBadge = 'badge-secondary';
        const s = v.status?.toUpperCase() || '';
        
        if (s === 'PENDING') statusBadge = 'badge-warning';
        else if (s.includes('REJECTED')) statusBadge = 'badge-danger';
        else if (s.includes('APPROVED_BY_HOST')) statusBadge = 'badge-info';
        else if (s.includes('APPROVED_BY_SECURITY')) statusBadge = 'badge-primary';
        else if (s === 'ENTERED') statusBadge = 'badge-success';
        else if (s === 'COMPLETED') statusBadge = 'badge-dark';

        const pass = v.Pass || v.pass || null;
        const passCode = pass ? `<code class="text-info">${pass.pass_code}</code>` : '<small class="text-muted">No Pass</small>';
        const securityName = pass?.Issuer?.full_name || pass?.Security?.full_name || '---';
        const formatT = (t) => t ? new Date(t).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}) : '---';
        const rejectionReason = v.rejection_reason ? `<br><small class="text-danger">Reason: ${v.rejection_reason}</small>` : '';

        return `
            <tr>
                <td><strong>${v.Visitor?.full_name || v.Guest?.full_name || 'Unknown'}</strong></td>
                <td>${v.Host?.full_name || 'N/A'}</td>
                <td>${passCode}</td>
                <td><small>${securityName}</small></td>
                <td>
                    <div style="font-size: 0.75rem;">
                        <span class="text-success">In: ${formatT(pass?.check_in_time)}</span><br>
                        <span class="text-danger">Out: ${formatT(pass?.check_out_time)}</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${statusBadge}">${s.replace(/_/g, ' ')}</span>
                    ${rejectionReason}
                </td>
            </tr>
        `;
    }).join('');
}