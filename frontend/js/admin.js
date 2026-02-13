document.addEventListener('DOMContentLoaded', () => {
    loadAdminUsers();
    loadAdminReports();
    loadAllVisitsForAdmin();
});

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
    } else {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${res.message || 'Failed to load users'}</td></tr>`;
    }
}

window.changeUserRole = async (userId, roleId) => {
    if (!roleId) return;
    if (!confirm("Are you sure you want to change this user's role?")) return;

    const res = await apiRequest(`/admin/users/${userId}/role`, 'PATCH', { role_id: parseInt(roleId) });
    
    if (res.is_successful) {
        showMessage("Role updated successfully!", true);
        loadAdminUsers();
    } else {
        showMessage(res.message || "Failed to update role");
    }
};

// -------------------- Visit Reports --------------------
async function loadAdminReports() {
    const res = await apiRequest('/admin/reports');
    if (!res.is_successful || !res.data.reports) return;

    const { user_summary, visit_stats } = res.data.reports;

    const totalUsersEl = document.getElementById('totalUsersCount');
    if (totalUsersEl) totalUsersEl.innerText = user_summary.total_count;

    const todayVisitsEl = document.getElementById('todayVisitsCount');
    if (todayVisitsEl && visit_stats.length > 0) todayVisitsEl.innerText = visit_stats[0].visit_count;

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
    const res = await apiRequest('/admin/reports');
    const tbody = document.getElementById('masterVisitList');
    if (!tbody) return;

    if (!res.is_successful || !res.data.visits) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${res.message || 'No visits data available'}</td></tr>`;
        return;
    }

    tbody.innerHTML = res.data.visits.map(v => {
        const visitorName = v.Visitor?.full_name || v.Guest?.full_name || 'N/A';
        const hostName = v.Host?.full_name || 'N/A';
        const passCode = v.Pass?.pass_code || '---';
        const securityName = v.Pass?.Security?.full_name || '---';

        const formatTime = t => t ? new Date(t).toLocaleString() : '---';
        let statusText = 'WAITING';
        let badgeClass = 'badge-secondary';

        if (v.Pass?.check_in_time && !v.Pass?.check_out_time) {
            statusText = 'ON-SITE';
            badgeClass = 'badge-success';
        } else if (v.Pass?.check_out_time) {
            statusText = 'COMPLETED';
            badgeClass = 'badge-dark';
        }

        return `
            <tr>
                <td>${visitorName}</td>
                <td>${hostName}</td>
                <td><code>${passCode}</code></td>
                <td>${securityName}</td>
                <td>
                    In: ${formatTime(v.Pass?.check_in_time)}<br>
                    Out: ${formatTime(v.Pass?.check_out_time)}
                </td>
                <td><span class="badge ${badgeClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}