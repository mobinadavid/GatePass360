document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/'; return; }

    try {
        const profileRes = await apiRequest('/auth/me');
        if (profileRes.is_successful) {
            const user = profileRes.data;
            const roles = user.roles.map(r => (typeof r === 'object' ? r.name : r));
            
            document.getElementById('display_name').innerText = user.full_name;
            document.getElementById('display_username').innerText = user.username;
            setupRoleBasedUI(roles);
        }
    } catch (err) { console.error("Profile load failed", err); }
});

function setupRoleBasedUI(roles) {
    const sections = {
        visitor: document.getElementById('visitorSection'),
        host: document.getElementById('hostSection'),
        security: document.getElementById('securitySection'),
        history: document.getElementById('historySection')
    };

    Object.values(sections).forEach(s => { if(s) s.style.display = 'none'; });

    const userRoles = roles.map(r => r.toLowerCase());

    if (userRoles.includes('admin') || userRoles.includes('security')) {
        if (sections.security) sections.security.style.display = 'block';
        loadActivePasses();
        loadSecurityPendingVisits();
        loadPresentReport();
    }

    if (userRoles.includes('admin') || userRoles.includes('host')) {
        if (sections.host) sections.host.style.display = 'block';
        if (sections.history) sections.history.style.display = 'block';
        loadHostPendingRequests();
        loadMyVisits();
        loadHosts();
    }

    if (userRoles.includes('guest') || userRoles.includes('visitor')) {
        if (sections.visitor) sections.visitor.style.display = 'block';
        if (sections.history) sections.history.style.display = 'block';
        loadHosts();
        loadMyVisits();
    }
}

function renderVisitTable(res, targetId) {
    const tbody = document.getElementById(targetId);
    if (res.data && res.data.visits) {
        tbody.innerHTML = res.data.visits.map(v => {
            let statusColor = '#f1c40f';
            let statusText = v.status.toUpperCase();

            if (v.status === 'approved' || v.status === 'approved_by_host') statusColor = '#2ecc71';
            if (v.status === 'rejected') statusColor = '#e74c3c';
            
            const passInfo = (v.Pass) ? `<br><small class="text-white">Code: ${v.Pass.pass_code}</small>` : '';
            const reason = (v.rejection_reason) ? `<br><small style="color: #ff9f89;">Reason: ${v.rejection_reason}</small>` : '';

            return `<tr>
                <td>${v.Host?.full_name || v.Guest?.full_name || v.Visitor?.full_name || 'N/A'}</td>
                <td>${v.visit_date}</td>
                <td style="color: ${statusColor}; font-weight: bold;">
                    ${statusText} ${passInfo} ${reason}
                </td>
            </tr>`;
        }).join('');
    }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });
}
