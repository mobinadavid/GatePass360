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
    if (res.is_successful && res.data.reports) {
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
                    <td><span class="badge badge-warning">${stat.visit_count}</span></td>
                </tr>
            `).join('');
        }
    }
}