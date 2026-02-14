async function loadAdminRolesForSelect() {
    const res = await apiRequest('/admin/roles');
    if (res.is_successful && res.data.roles) {
        return res.data.roles.map(role =>
            `<option value="${role.id}">${role.name.toUpperCase()}</option>`
        ).join('');
    }
    return '';
}

async function loadAdminUsers() {
    const res = await apiRequest('/admin/users');
    const roleOptions = await loadAdminRolesForSelect(); // Get dynamic roles
    const tbody = document.getElementById('adminUserList');
    if (!tbody) return;

    if (res.is_successful && res.data.users) {
        tbody.innerHTML = res.data.users.map(user => `
            <tr>
                <td>${user.full_name}</td>
                <td>@${user.username}</td>
                <td>
                    ${user.Roles.map(r => `<span class="badge badge-info">${r.name}</span>`).join(' ')}
                </td>
                <td>
                    <select class="form-style" style="height: 38px; padding: 5px;" onchange="changeUserRole(${user.id}, this.value)">
                        <option value="">Assign Role...</option>
                        ${roleOptions}
                    </select>
                </td>
            </tr>
        `).join('');
    }
}

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

async function populateAdminHostFilter() {
    const res = await apiRequest('/users/hosts');
    const select = document.getElementById('adminFilterHost');
    if (res.is_successful && select) {
        res.data.hosts.forEach(host => {
            const opt = document.createElement('option');
            opt.value = host.id;
            opt.innerText = host.full_name;
            select.appendChild(opt);
        });
    }
}

async function loadAllVisitsForAdmin() {
    const hostId = document.getElementById('adminFilterHost').value;
    const status = document.getElementById('adminFilterStatus').value;

    // Build the query string based on selection
    let query = '';
    if (hostId || status) {
        const params = new URLSearchParams();
        if (hostId) params.append('host_id', hostId);
        if (status) params.append('status', status);
        query = `?${params.toString()}`;
    }

    // Call the dedicated admin visits endpoint
    const res = await apiRequest(`/visits${query}`);
    const tbody = document.getElementById('masterVisitList');
    if (!tbody) return;

    if (!res.is_successful || !res.data.visits) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">No data found</td></tr>`;
        return;
    }

    tbody.innerHTML = res.data.visits.map(v => {
        const visitorName = v.Guest?.full_name || v.Visitor?.full_name || 'N/A';
        const hostName = v.Host?.full_name || 'N/A';
        const passCode = v.Pass?.pass_code || '---';
        const statusText = v.status.toUpperCase().replace(/_/g, ' ');

        return `
            <tr>
                <td>${visitorName}</td>
                <td>${hostName}</td>
                <td><code>${passCode}</code></td>
                <td>${v.Pass?.Security?.full_name || '---'}</td>
                <td>
                    In: ${v.Pass?.check_in_time ? new Date(v.Pass.check_in_time).toLocaleString() : '---'}<br>
                    Out: ${v.Pass?.check_out_time ? new Date(v.Pass.check_out_time).toLocaleString() : '---'}
                </td>
                <td><span class="badge badge-info">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}