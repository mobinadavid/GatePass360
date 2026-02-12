document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    try {
        const profileRes = await apiRequest('/auth/me');
        if (profileRes.is_successful) {
            const user = profileRes.data;
            const roles = user.roles.map(r => (typeof r === 'object' ? r.name : r));

            document.getElementById('display_name').innerText = user.full_name;
            document.getElementById('display_username').innerText = user.username;
            setupRoleBasedUI(roles);
        }
    } catch (err) {
        console.error("Profile load failed", err);
    }

    function setupRoleBasedUI(roles) {
        const visitorSec = document.getElementById('visitorSection');
        const hostSec = document.getElementById('hostSection');
        const securitySec = document.getElementById('securitySection');
        const historySec = document.getElementById('historySection');
    
        if (visitorSec) visitorSec.style.display = 'none';
        if (hostSec) hostSec.style.display = 'none';
        if (securitySec) securitySec.style.display = 'none';
        if (historySec) historySec.style.display = 'none';
        if (roles.includes('admin')) {
            // if (visitorSec) visitorSec.style.display = 'block';
            if (hostSec) hostSec.style.display = 'block';
            if (securitySec) securitySec.style.display = 'block';
            // if (historySec) historySec.style.display = 'block';
            
            loadHosts();
            //loadMyVisits();
            loadHostPendingRequests();
            loadActivePasses();
            return; 
        }
    
        if (roles.includes('security')) {
            if (securitySec) securitySec.style.display = 'block';
            loadActivePasses();
        }

        if (roles.includes('host')) {
            if (hostSec) hostSec.style.display = 'block';
            if (historySec) historySec.style.display = 'block';
            
            loadHostPendingRequests();
            loadMyVisits();
            loadHosts();
        }
    
        if (roles.includes('guest')) {
            if (visitorSec) visitorSec.style.display = 'block';
            if (historySec) historySec.style.display = 'block';
            
            loadHosts();
            loadMyVisits();
        }
    }

    async function loadHosts() {
        const res = await apiRequest('/users/hosts');
        const hostSelect = document.getElementById('host_id');
        if (res.is_successful && res.data.hosts) {
            hostSelect.innerHTML = '<option value="" disabled selected>Select Host...</option>';
            res.data.hosts.forEach(host => {
                const opt = new Option(host.full_name, host.id);
                hostSelect.add(opt);
            });
        }
    }

    async function loadMyVisits() {
        const res = await apiRequest('/visits/me');
        renderVisitTable(res, 'visitList');
    }

    async function loadHostPendingRequests() {
        const res = await apiRequest('/visits/host');
        const tbody = document.getElementById('hostRequestList');
        if (res.is_successful && res.data.visits) {
            tbody.innerHTML = res.data.visits.map(v => `
                <tr>
                    <td>${v.Visitor?.full_name}</td>
                    <td>${v.visit_date}</td>
                    <td>${v.purpose}</td>
                    <td>
                        <button onclick="handleStatus(${v.id}, 'approved')" class="btn btn-sm btn-success">Approve</button>
                        <button onclick="handleStatus(${v.id}, 'rejected')" class="btn btn-sm btn-danger">Reject</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    window.handleStatus = async (id, status) => {
        const res = await apiRequest(`/visits/${id}/status`, 'PATCH', { status });
        if (res.is_successful) {
            alert(`Visit ${status}!`);
            loadHostPendingRequests();
        }
    };

    async function loadActivePasses() {
        const res = await apiRequest('/passes');
        const tbody = document.getElementById('activePassesList');
        if (res.is_successful && res.data.passes) {
            tbody.innerHTML = res.data.passes.map(p => `
                <tr>
                    <td>${p.Visit?.Visitor?.full_name}</td>
                    <td>${p.status}</td>
                    <td>
                        <button onclick="logTraffic(${p.id}, 'entry')" class="btn btn-sm btn-primary">Entry</button>
                        <button onclick="logTraffic(${p.id}, 'exit')" class="btn btn-sm btn-secondary">Exit</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    window.logTraffic = async (passId, type) => {
        const res = await apiRequest('/passes/log-traffic', 'POST', { pass_id: passId, type });
        if (res.is_successful) {
            alert(`Traffic recorded: ${type}`);
            loadActivePasses();
        }
    };

    document.getElementById('visitForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            host_id: document.getElementById('host_id').value,
            purpose: document.getElementById('purpose').value,
            visit_date: document.getElementById('visit_date').value
        };
        const res = await apiRequest('/visits', 'POST', payload);
        if (res.is_successful) {
            alert("Request sent!");
            loadMyVisits();
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });

    function renderVisitTable(res, targetId) {
        const tbody = document.getElementById(targetId);
        if (res.is_successful && res.data.visits) {
            tbody.innerHTML = res.data.visits.map(v => {
                const color = v.status === 'approved' ? '#2ecc71' : v.status === 'pending_host' ? '#f1c40f' : '#e74c3c';
                return `<tr>
                    <td>${v.Host?.full_name || 'N/A'}</td>
                    <td>${v.visit_date}</td>
                    <td style="color: ${color}">${v.status}</td>
                </tr>`;
            }).join('');
        }
    }
});