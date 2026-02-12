document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    try {
        const profileRes = await apiRequest('/auth/me');
        if (profileRes.is_successful) {
            document.getElementById('display_name').innerText = profileRes.data.full_name;
            document.getElementById('display_username').innerText = profileRes.data.username;
        }
    } catch (err) {
        console.error("Profile load failed", err);
    }
    async function loadHosts() {
        const res = await apiRequest('/users/hosts');
        const hostSelect = document.getElementById('host_id');
        if (res.is_successful && res.data.hosts) {
            res.data.hosts.forEach(host => {
                const opt = document.createElement('option');
                opt.value = host.id;
                opt.text = host.full_name;
                hostSelect.add(opt);
            });
        }
    }
    async function loadVisits() {
        const res = await apiRequest('/visits/me');
        const tbody = document.getElementById('visitList');
        tbody.innerHTML = '';

        if (res.is_successful && res.data.visits) {
            res.data.visits.forEach(v => {
                const statusColor = v.status === 'approved' ? '#2ecc71' : v.status === 'pending_host' ? '#f1c40f' : '#e74c3c';
                tbody.innerHTML += `
                    <tr>
                        <td>${v.Host?.full_name || 'N/A'}</td>
                        <td>${v.visit_date}</td>
                        <td style="color: ${statusColor}">${v.status}</td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="3">No history found.</td></tr>';
        }
    }

    document.getElementById('visitForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            host_id: document.getElementById('host_id').value,
            purpose: document.getElementById('purpose').value,
            visit_date: document.getElementById('visit_date').value
        };

        const res = await apiRequest('/visits', 'POST', payload);
        if (res.is_successful) {
            alert("Request sent successfully!");
            loadVisits();
        } else {
            alert("Error: " + (res.message || "Failed to send request"));
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });
    loadHosts();
    loadVisits();
});