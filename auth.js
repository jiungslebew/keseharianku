// Authentication system with proper error handling

// Sample user data - in a real app, this would be in a database
const users = [
    {
        id: 1,
        fullName: "Ahmad Santoso",
        email: "ahmad@example.com",
        password: "password123"
    },
    {
        id: 2,
        fullName: "Siti Nurhaliza",
        email: "siti@example.com", 
        password: "siti123"
    },
    {
        id: 3,
        fullName: "Budi Prasetyo",
        email: "budi@example.com",
        password: "budi456"
    }
];

// Load existing users from localStorage if available
function loadUsers() {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Merge with default users, avoiding duplicates
        parsedUsers.forEach(savedUser => {
            if (!users.find(user => user.email === savedUser.email)) {
                users.push(savedUser);
            }
        });
    }
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// Initialize
loadUsers();

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

function hideSuccess(elementId) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = '';
        successElement.style.display = 'none';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Clear all error messages
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const successElements = document.querySelectorAll('.success-message');
    successElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Login functionality
function handleLogin(event) {
    event.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    let hasError = false;
    
    if (!email) {
        showError('emailError', 'Email harus diisi');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('emailError', 'Format email tidak valid');
        hasError = true;
    }
    
    if (!password) {
        showError('passwordError', 'Password harus diisi');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        showError('loginError', 'Email tidak terdaftar. Silakan daftar terlebih dahulu.');
        return;
    }
    
    if (user.password !== password) {
        showError('loginError', 'Password salah. Silakan coba lagi.');
        return;
    }
    
    // Login successful
    showSuccess('loginSuccess', 'Login berhasil! Mengalihkan ke dashboard...');
    
    // Store login state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.email
    }));
    
    if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
    }
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Registration functionality
function handleRegister(event) {
    event.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    let hasError = false;
    
    if (!fullName) {
        showError('fullNameError', 'Nama lengkap harus diisi');
        hasError = true;
    } else if (fullName.length < 2) {
        showError('fullNameError', 'Nama lengkap minimal 2 karakter');
        hasError = true;
    }
    
    if (!email) {
        showError('emailError', 'Email harus diisi');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('emailError', 'Format email tidak valid');
        hasError = true;
    } else if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showError('emailError', 'Email sudah terdaftar');
        hasError = true;
    }
    
    if (!password) {
        showError('passwordError', 'Password harus diisi');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError('passwordError', 'Password minimal 6 karakter');
        hasError = true;
    }
    
    if (!confirmPassword) {
        showError('confirmPasswordError', 'Konfirmasi password harus diisi');
        hasError = true;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Konfirmasi password tidak cocok');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        fullName: fullName,
        email: email,
        password: password
    };
    
    users.push(newUser);
    saveUsers();
    
    // Show success message
    showSuccess('registerSuccess', 'Pendaftaran berhasil! Mengalihkan ke halaman login...');
    
    // Redirect to login after short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Check authentication status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn !== 'true' || !currentUser) {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

// Logout functionality
function logout() {
    // Clear login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    
    // Clear browser history to prevent back button issues
    if (window.history && window.history.pushState) {
        window.history.pushState(null, null, 'index.html');
        window.location.replace('index.html');
    } else {
        window.location.href = 'index.html';
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Check if already logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            window.location.href = 'dashboard.html';
            return;
        }
        
        loginForm.addEventListener('submit', handleLogin);
        
        // Pre-fill email if remembered
        const rememberUser = localStorage.getItem('rememberUser');
        if (rememberUser === 'true') {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                document.getElementById('email').value = user.email;
                document.getElementById('rememberMe').checked = true;
            }
        }
    }
    
    // Check if we're on register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Check if already logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            window.location.href = 'dashboard.html';
            return;
        }
        
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Clear error when user starts typing
            const errorId = this.id + 'Error';
            hideError(errorId);
        });
    });
});

// Prevent back button issues
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Prevent caching
window.addEventListener('beforeunload', function() {
    // Force reload on back button
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
});