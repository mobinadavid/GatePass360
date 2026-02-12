async function loadHosts() {
    const res = await apiRequest('/users/hosts');
    const hostSelect = document.getElementById('host_id');
    if (res.is_successful && res.data && res.data.hosts) {
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

const visitForm = document.getElementById('visitForm');
if (visitForm) {
    visitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            host_id: document.getElementById('host_id').value,
            purpose: document.getElementById('purpose').value,
            visit_date: document.getElementById('visit_date').value
        };
        const res = await apiRequest('/visits', 'POST', payload);
        if (res.is_successful) { alert("Request sent!"); loadMyVisits(); }
        else { alert(res.message || "Failed to send request"); }
    });
}
