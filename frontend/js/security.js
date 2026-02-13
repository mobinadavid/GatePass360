async function loadSecurityPendingVisits() {
    const res = await apiRequest('/visits/pending-visits'); 
    const tbody = document.getElementById('securityPendingList');
    if (!tbody) return;

    if (res.data && res.data.visits) {
        const visits = res.data.visits;
        
        if (visits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No approved visits found.</td></tr>';
            return;
        }

        tbody.innerHTML = visits.map(v => `
            <tr>
                <td>${v.Guest?.full_name || v.Visitor?.full_name || 'N/A'}</td>
                <td>${v.Host?.full_name || 'N/A'}</td>
                <td>${v.visit_date}</td>
                <td>
                    <button onclick="issuePass(${v.id})" class="btn btn-sm btn-primary">Issue Pass</button>
                </td>
            </tr>
        `).join('');
    }
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
    if (res.is_successful) { 
        alert("Entry recorded"); 
        loadActivePasses(); 
        loadPresentReport(); 
        loadSecurityLogs();
    } else alert(res.message);
};

window.handleCheckOutFromList = async (code) => {
    const res = await apiRequest('/passes/check-out', 'POST', { pass_code: code });
    if (res.is_successful) { 
        alert("Exit recorded"); 
        loadActivePasses(); 
        loadPresentReport(); 
        loadSecurityLogs();
    } else alert(res.message);
};

async function loadActivePasses() {
    const res = await apiRequest('/passes');
    const tbody = document.getElementById('activePassesList');
    if (!tbody) return;
    const passes = res.data?.passes || []; 
    
    if (passes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No active passes.</td></tr>';
        return;
    }

    tbody.innerHTML = passes.map(p => {
        let displayStatus = 'Issued';
        let badgeClass = 'badge-info';

        if (p.check_out_time) {
            displayStatus = 'Completed';
            badgeClass = 'badge-secondary';
        } else if (p.check_in_time) {
            displayStatus = 'On-Site';
            badgeClass = 'badge-success';
        }

        return `
            <tr>
                <td>${p.Visit?.Guest?.full_name || p.Visit?.Visitor?.full_name || 'Visitor'}</td>
                <td><span class="badge ${badgeClass}">${displayStatus}</span></td>
                <td>
                    <div class="btn-group">
                        ${!p.check_in_time ? `<button onclick="handleCheckInFromList('${p.pass_code}')" class="btn btn-sm btn-success">Check-In</button>` : ''}
                        
                        ${p.check_in_time && !p.check_out_time ? `<button onclick="handleCheckOutFromList('${p.pass_code}')" class="btn btn-sm btn-danger ml-1">Check-Out</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function loadPresentReport() {
    const res = await apiRequest('/passes/reports/present');
    const tbody = document.getElementById('presentPeopleList');
    if (!tbody) return;
    const presentList = res.data?.present_visitors || []; 

    tbody.innerHTML = presentList.length === 0 
        ? '<tr><td colspan="4" class="text-center">No visitors on-site</td></tr>'
        : presentList.map(p => `
            <tr>
                <td>${p.Visit?.Visitor?.full_name || p.Visit?.Guest?.full_name || 'N/A'}</td>
                <td><code>${p.pass_code}</code></td>
                <td>${new Date(p.check_in_time).toLocaleTimeString()}</td>
                <td><span class="badge badge-success">ON-SITE</span></td>
            </tr>
        `).join('');
}

async function loadSecurityLogs() {
    const res = await apiRequest('/passes'); 
    const tbody = document.getElementById('securityLogsList');
    if (!tbody || !res.is_successful) return;

    const passes = res.data?.passes || [];

    if (passes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No pass records for today.</td></tr>';
        return;
    }

    tbody.innerHTML = passes.map(p => {
        const guestName = p.Visit?.Guest?.full_name || p.Visit?.Visitor?.full_name || 'Visitor';
        const formatT = (t) => t ? new Date(t).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}) : '---';
        
        let badgeClass = 'badge-secondary';
        let statusText = 'WAITING';

        if (p.check_out_time) {
            badgeClass = 'badge-dark'; 
            statusText = 'COMPLETED';
        } else if (p.check_in_time) {
            badgeClass = 'badge-success'; 
            statusText = 'ON-SITE';
        }

        return `
            <tr>
                <td><strong>${guestName}</strong></td>
                <td><code class="text-info">${p.pass_code}</code></td>
                <td>
                    <div style="font-size: 0.75rem;">
                        <span class="text-success">In: ${formatT(p.check_in_time)}</span><br>
                        <span class="text-danger">Out: ${formatT(p.check_out_time)}</span>
                    </div>
                </td>
                <td><span class="badge ${badgeClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}
