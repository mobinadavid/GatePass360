const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers, body: body ? JSON.stringify(body) : null };
    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { is_successful: false, message: "Server connection failed" };
    }
}