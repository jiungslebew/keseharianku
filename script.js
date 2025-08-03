// Main navigation functions for landing page

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn === 'true' && currentUser) {
        // If already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});

// Navigation functions
function goToLogin() {
    window.location.href = 'login.html';
}

function goToRegister() {
    window.location.href = 'register.html';
}

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});