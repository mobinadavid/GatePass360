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

    function setupRoleBasedUI(roles) {
        const sections = {
            visitor: document.getElementById('visitorSection'),
            host: document.getElementById('hostSection'),
            security: document.getElementById('securitySection'),
            history: document.getElementById('historySection')
        };

        Object.values(sections).forEach(s => { if(s) s.style.display = 'none'; });

        if (roles.includes('admin') || roles.includes('security')) {
            if (sections.security) sections.security.style.display = 'block';
            loadActivePasses();
            loadSecurityPendingVisits();
            loadPresentReport();
        }

        if (roles.includes('admin') || roles.includes('host')) {
            if (sections.host) sections.host.style.display = 'block';
            if (sections.history) sections.history.style.display = 'block';
            loadHostPendingRequests();
            loadMyVisits();
            loadHosts();
        }

        if (roles.includes('guest')) {
            if (sections.visitor) sections.visitor.style.display = 'block';
            if (sections.history) sections.history.style.display = 'block';
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
            const pendingVisits = res.data.visits.filter(v => v.status === 'pending_host');

            if (pendingVisits.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No pending requests</td></tr>';
                return;
            }

            tbody.innerHTML = pendingVisits.map(v => `
                <tr>
                    <td>${v.Visitor?.full_name || 'Unknown'}</td>
                    <td>${v.visit_date}</td>
                    <td>${v.purpose}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" onclick="handleStatus(${v.id}, 'approved')" class="btn btn-sm btn-success mr-2">Confirm</button>
                            <button type="button" onclick="handleStatus(${v.id}, 'rejected')" class="btn btn-sm btn-danger">Reject</button>
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
            if (reason.trim() === "") {
                alert("Reason is required for rejection!");
                return;
            }
            payload = { reason: reason };
        } else {
            if (!confirm("Are you sure you want to approve this visit?")) return;
            payload = {};
        }

        const endpoint = status === 'approved' ? 'approve' : 'reject';

        try {
            const res = await apiRequest(`/visits/${id}/${endpoint}`, 'PATCH', payload);

            if (res.is_successful) {
                alert(`Visit ${status} successfully!`);
                loadHostPendingRequests();
                loadMyVisits();
            } else {
                alert("Error: " + (res.message || "Operation failed"));
            }
        } catch (err) {
            console.error("Status update failed", err);
            alert("Connection error!");
        }
    };

    window.handleCheckInFromList = async (code) => {
        const res = await apiRequest('/passes/check-in', 'POST', { pass_code: code });
        if (res.is_successful) { alert("Entry recorded"); loadActivePasses(); loadPresentReport(); }
        else alert(res.message);
    };

    window.logTraffic = async (passId, type) => {
        const endpoint = type === 'entry' ? 'check-in' : 'check-out';

        const res = await apiRequest(`/passes/${endpoint}`, 'POST', { pass_id: passId });
        if (res.is_successful) {
            alert(`Traffic recorded: ${type}`);
            loadActivePasses();
        } else {
            alert("Error: " + res.message);
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
                let statusColor = '#f1c40f';
                if (v.status === 'approved') statusColor = '#2ecc71';
                if (v.status === 'rejected') statusColor = '#e74c3c';
                const passInfo = (v.status === 'approved' && v.Pass)
                    ? `<br><small class="text-white">Code: ${v.Pass.pass_code}</small>`
                    : '';
                const rejectReason = (v.status === 'rejected' && v.rejection_reason)
                    ? `<br><small style="color: #ff9f89; font-style: italic;">Reason: ${v.rejection_reason}</small>`
                    : '';

                return `<tr>
                    <td>${v.Host?.full_name || v.Visitor?.full_name || 'N/A'}</td>
                    <td>${v.visit_date}</td>
                    <td style="color: ${statusColor}; font-weight: bold;">
                        ${v.status.toUpperCase()}
                        ${passInfo}
                        ${rejectReason}
                    </td>
                </tr>`;
            }).join('');
        }
    }


    async function loadSecurityPendingVisits() {
        const res = await apiRequest('/visits/pending-visits'); 
        const tbody = document.getElementById('securityPendingList');
        
        if (!tbody) return;
    
        if (res.is_successful && res.data && res.data.visits) {
            const visits = res.data.visits;
            
            if (visits.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No approved visits found.</td></tr>';
                return;
            }
    
            tbody.innerHTML = visits.map(v => `
                <tr>
                    <td>${v.Guest?.full_name || 'N/A'}</td>
                    <td>${v.Host?.full_name || 'N/A'}</td>
                    <td>${v.visit_date}</td>
                    <td>
                        <button onclick="issuePass(${v.id})" class="btn btn-sm btn-primary">Issue Pass</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    async function loadActivePasses() {
        const res = await apiRequest('/passes');
        const tbody = document.getElementById('activePassesList');
        if (!tbody || !res.is_successful) return;
    
        const passes = res.data?.passes || res.data || [];
        
        if (passes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No active passes.</td></tr>';
            return;
        }
    
        tbody.innerHTML = passes.map(p => `
            <tr>
                <td>${p.Visit?.Guest?.full_name || p.Visit?.Visitor?.full_name || 'Visitor'}</td>
                <td><span class="badge badge-info">${p.status}</span></td>
                <td>
                    <div class="btn-group">
                        <button onclick="handleCheckInFromList('${p.pass_code}')" class="btn btn-sm btn-success">Check-In</button>
                        <button onclick="handleCheckOutFromList('${p.pass_code}')" class="btn btn-sm btn-danger ml-1">Check-Out</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async function loadPresentReport() {
        const res = await apiRequest('/passes/reports/present');
        const tbody = document.getElementById('presentPeopleList');
        if (!tbody) return;

        const presentList = res.data || [];
        tbody.innerHTML = presentList.length === 0 
            ? '<tr><td colspan="4" class="text-center">No visitors on-site</td></tr>'
            : presentList.map(p => `
                <tr>
                    <td>${p.Visit?.Visitor?.full_name || 'N/A'}</td>
                    <td><code>${p.pass_code}</code></td>
                    <td>${p.check_in_time || '---'}</td>
                    <td><span class="badge badge-success">ON-SITE</span></td>
                </tr>
            `).join('');
    }

    window.issuePass = async (visitId) => {
        if (!confirm("Issue pass for this visitor?")) return;
        const res = await apiRequest('/passes', 'POST', { visit_id: visitId });
        if (res.is_successful) {
            alert("Pass issued!");
            loadSecurityPendingVisits();
            loadActivePasses();
        } else alert(res.message);
    };

    window.handleCheckInFromList = async (code) => {
        const res = await apiRequest('/passes/check-in', 'POST', { pass_code: code });
        if (res.is_successful) { alert("Entry recorded"); loadActivePasses(); loadPresentReport(); }
        else alert(res.message);
    };

    window.handleCheckOutFromList = async (code) => {
        const res = await apiRequest('/passes/check-out', 'POST', { pass_code: code });
        if (res.is_successful) { alert("Exit recorded"); loadActivePasses(); loadPresentReport(); }
        else alert(res.message);
    };

});