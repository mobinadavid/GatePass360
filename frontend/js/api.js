const API_URL = 'http://localhost:3000/api'; // آدرس سرور خودت را چک کن

async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };

    if (data) config.body = JSON.stringify(data);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
            return;
        }

        const result = await response.json();
        
        // اضافه کردن کد وضعیت به خروجی برای استفاده در داشبورد
        return { 
            ...result, 
            status_code: response.status,
            is_successful: response.ok 
        };
    } catch (error) {
        console.error("API Error:", error);
        return { is_successful: false, message: "Connection Error", status_code: 500 };
    }
}