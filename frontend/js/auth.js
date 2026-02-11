function showMessage(text, isSuccess = false) {
    const msgBox = document.getElementById('messageBox');
    if (!msgBox) return;

    msgBox.innerText = text;
    msgBox.style.display = 'block';
    
    if (isSuccess) {
        msgBox.style.backgroundColor = '#d4edda';
        msgBox.style.color = '#155724';
        msgBox.style.border = '1px solid #c3e6cb';
    } else {
        msgBox.style.backgroundColor = '#f8d7da';
        msgBox.style.color = '#721c24';
        msgBox.style.border = '1px solid #f5c6cb';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const res = await apiRequest('/auth/login', 'POST', {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            });

            if (res.is_successful) {
                localStorage.setItem('token', res.data.token);
                showMessage("Login successful! Redirecting...", true);
                setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
            } else {
                showMessage(res.message || "Invalid credentials");
            }
        });
    }

    // 2. Handle Register
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                full_name: document.getElementById('full_name').value,
                username: document.getElementById('username').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value
            };

            const res = await apiRequest('/auth/register', 'POST', payload);
            
            if (res.is_successful) {
                showMessage("Registration successful! Moving to login...", true);
                setTimeout(() => { window.location.href = '/'; }, 2000);
            } else { 
                let errorText = res.message || "Registration failed";
                if (res.errors) {
                    errorText = Array.isArray(res.errors) ? res.errors[0].msg : JSON.stringify(res.errors);
                }
                showMessage(errorText); 
            }
        });
    }
});