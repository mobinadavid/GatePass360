async function loadProfile() {
    const res = await apiRequest('/auth/me', 'GET');
    if (res.is_successful) {
        document.getElementById('display_name').innerText = res.data.full_name;
        document.getElementById('display_username').innerText = res.data.username;
    } else {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
});

document.addEventListener('DOMContentLoaded', loadProfile);