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
    } else alert(res.message);
};

window.handleCheckOutFromList = async (code) => {
    const res = await apiRequest('/passes/check-out', 'POST', { pass_code: code });
    if (res.is_successful) { 
        alert("Exit recorded"); 
        loadActivePasses(); 
        loadPresentReport(); 
    } else alert(res.message);
};

async function loadActivePasses() {
    const res = await apiRequest('/passes');
    const tbody = document.getElementById('activePassesList');
    if (!tbody) return;

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
                <td>${p.Visit?.Visitor?.full_name || p.Visit?.Guest?.full_name || 'N/A'}</td>
                <td><code>${p.pass_code}</code></td>
                <td>${p.check_in_time || '---'}</td>
                <td><span class="badge badge-success">ON-SITE</span></td>
            </tr>
        `).join('');
}
