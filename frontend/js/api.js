// استفاده از آدرس نسبی اگر فرانت و بک روی یک پورت هستند
const API_URL = "/api"; 

async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    
    const headers = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // اضافه کردن توکن به هدر در صورت وجود
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { 
        method, 
        headers, 
        body: body ? JSON.stringify(body) : null 
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        // اگر توکن منقضی شده بود (کد 401)، کاربر را به لاگین بفرست
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
            return;
        }

        const result = await response.json();
        return result; 

    } catch (error) {
        console.error("🚨 API Connection Error:", error);
        return { 
            is_successful: false, 
            message: "ارتباط با سرور برقرار نشد. لطفا اینترنت خود را چک کنید." 
        };
    }
}