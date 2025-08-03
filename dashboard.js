// Dashboard functionality

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) {
        return; // checkAuth will redirect to login
    }
    
    // Update welcome message
    const welcomeElement = document.getElementById('userWelcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Selamat datang, ${user.fullName}!`;
    }
    
    // Initialize dashboard features
    initializeDashboard();
    updateCountdown();
    
    // Update countdown every minute
    setInterval(updateCountdown, 60000);
});

// Authentication check function (reused from auth.js)
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

// Initialize dashboard features
function initializeDashboard() {
    // Add click handlers for schedule items
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.addEventListener('click', function() {
            toggleScheduleItem(this);
        });
    });
    
    // Load saved progress from localStorage
    loadProgress();
    updateStats();
}

// Toggle schedule item completion
function toggleScheduleItem(item) {
    const status = item.querySelector('.status');
    const activity = item.querySelector('.activity').textContent;
    
    if (status.classList.contains('completed')) {
        // Mark as pending
        status.classList.remove('completed');
        status.classList.add('pending');
        status.textContent = '○';
        status.style.color = '#bdc3c7';
        
        // Remove from completed activities
        removeFromCompleted(activity);
    } else {
        // Mark as completed
        status.classList.remove('pending');
        status.classList.add('completed');
        status.textContent = '✓';
        status.style.color = '#27ae60';
        
        // Add to completed activities
        addToCompleted(activity);
    }
    
    // Update stats
    updateStats();
    saveProgress();
}

// Save progress to localStorage
function saveProgress() {
    const completedItems = [];
    const completedElements = document.querySelectorAll('.status.completed');
    
    completedElements.forEach(element => {
        const item = element.closest('.schedule-item');
        const activity = item.querySelector('.activity').textContent;
        const time = item.querySelector('.time').textContent;
        completedItems.push({ activity, time });
    });
    
    localStorage.setItem('dailyProgress', JSON.stringify(completedItems));
    localStorage.setItem('progressDate', new Date().toDateString());
}

// Load progress from localStorage
function loadProgress() {
    const savedDate = localStorage.getItem('progressDate');
    const today = new Date().toDateString();
    
    // Only load progress if it's from today
    if (savedDate === today) {
        const savedProgress = localStorage.getItem('dailyProgress');
        if (savedProgress) {
            const completedItems = JSON.parse(savedProgress);
            
            completedItems.forEach(saved => {
                const scheduleItems = document.querySelectorAll('.schedule-item');
                scheduleItems.forEach(item => {
                    const activity = item.querySelector('.activity').textContent;
                    const time = item.querySelector('.time').textContent;
                    
                    if (activity === saved.activity && time === saved.time) {
                        const status = item.querySelector('.status');
                        status.classList.remove('pending');
                        status.classList.add('completed');
                        status.textContent = '✓';
                        status.style.color = '#27ae60';
                    }
                });
            });
        }
    } else {
        // New day, clear old progress
        localStorage.removeItem('dailyProgress');
        localStorage.removeItem('progressDate');
    }
}

// Add activity to completed list
function addToCompleted(activity) {
    // This could be expanded to track completion times, etc.
    console.log(`Completed: ${activity}`);
}

// Remove activity from completed list
function removeFromCompleted(activity) {
    // This could be expanded to track removal times, etc.
    console.log(`Unmarked: ${activity}`);
}

// Update statistics
function updateStats() {
    const totalSholat = document.querySelectorAll('.card:first-child .schedule-item').length;
    const completedSholat = document.querySelectorAll('.card:first-child .status.completed').length;
    
    const totalActivities = document.querySelectorAll('.card:nth-child(2) .schedule-item').length;
    const completedActivities = document.querySelectorAll('.card:nth-child(2) .status.completed').length;
    
    const totalItems = totalSholat + totalActivities;
    const completedItems = completedSholat + completedActivities;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    // Update stat displays
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = completedSholat;
        statNumbers[1].textContent = completedActivities;
        statNumbers[2].textContent = progressPercentage + '%';
    }
}

// Update countdown for next reminder
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Prayer times (in minutes from midnight)
    const prayerTimes = [
        { name: 'Subuh', time: 5 * 60 }, // 05:00
        { name: 'Dzuhur', time: 12 * 60 + 15 }, // 12:15
        { name: 'Ashar', time: 15 * 60 + 30 }, // 15:30
        { name: 'Maghrib', time: 18 * 60 + 45 }, // 18:45
        { name: 'Isya', time: 20 * 60 } // 20:00
    ];
    
    // Find next prayer
    let nextPrayer = null;
    for (const prayer of prayerTimes) {
        if (prayer.time > currentTime) {
            nextPrayer = prayer;
            break;
        }
    }
    
    // If no prayer found today, use tomorrow's Subuh
    if (!nextPrayer) {
        nextPrayer = { name: 'Subuh', time: 5 * 60 + (24 * 60) }; // Tomorrow's Subuh
    }
    
    const minutesUntilNext = nextPrayer.time - currentTime;
    const hoursUntilNext = Math.floor(minutesUntilNext / 60);
    const remainingMinutes = minutesUntilNext % 60;
    
    // Update reminder display
    const reminderTime = document.querySelector('.reminder-time');
    const reminderActivity = document.querySelector('.reminder-activity');
    
    if (reminderTime && reminderActivity) {
        const displayTime = nextPrayer.time >= 24 * 60 ? 
            '05:00' : 
            String(Math.floor(nextPrayer.time / 60)).padStart(2, '0') + ':' + 
            String(nextPrayer.time % 60).padStart(2, '0');
            
        reminderTime.textContent = displayTime;
        reminderActivity.textContent = `Sholat ${nextPrayer.name}`;
    }
    
    // Update countdown
    if (hoursUntilNext > 0) {
        countdownElement.textContent = `Dalam ${hoursUntilNext} jam ${remainingMinutes} menit`;
    } else {
        countdownElement.textContent = `Dalam ${remainingMinutes} menit`;
    }
}

// Prevent back button issues
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Prevent unauthorized access via back button
window.addEventListener('popstate', function(event) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
});