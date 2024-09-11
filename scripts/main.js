// Helper functions to set and get cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// Function to load balance and energy from cookies or set defaults
function loadUserDataFromCookies() {
    let balance = getCookie('balance');
    let energy = getCookie('energy');

    if (!balance) {
        balance = 0;  // default balance
        setCookie('balance', balance, 7);  // set default balance in cookie
    }
    if (!energy) {
        energy = "500/500";  // default energy
        setCookie('energy', energy, 7);  // set default energy in cookie
    }

    document.getElementById("balance").textContent = balance;
    document.getElementById("energy").textContent = energy;
}

// Save the balance and energy to cookies
function saveUserDataToCookies(balance, energy) {
    setCookie('balance', balance, 7);  // Save balance for 7 days
    setCookie('energy', energy, 7);  // Save energy for 7 days
}

// Handle "Tap to Earn" functionality
document.getElementById('coin').addEventListener('click', async () => {
    let balance = parseInt(document.getElementById("balance").textContent, 10);
    let energy = parseInt(document.getElementById("energy").textContent.split('/')[0], 10);

    if (energy > 0) {
        balance += 1;  // Increase balance by 1
        energy -= 1;  // Decrease energy by 1

        document.getElementById("balance").textContent = balance;
        document.getElementById("energy").textContent = `${energy}/500`;

        // Save to cookies
        saveUserDataToCookies(balance, `${energy}/500`);
    } else {
        alert("No energy left. Please wait for regeneration.");
    }
});

// Mark task as completed in localStorage
function markTaskCompleted(taskId) {
    localStorage.setItem(`task_${taskId}`, "completed");
}

// Check if the task is already completed
function isTaskCompleted(taskId) {
    return localStorage.getItem(`task_${taskId}`) === "completed";
}

// Update task button UI if the task is completed
function updateTaskButton(taskId, taskName) {
    if (isTaskCompleted(taskId)) {
        document.getElementById(taskId).textContent = `${taskName} Completed`;
        document.getElementById(taskId).disabled = true;
    }
}

// Task completion handling
async function completeTask(taskId, taskName) {
    if (!isTaskCompleted(taskId)) {
        document.getElementById(taskId).disabled = true;

        setTimeout(() => {
            let balance = parseInt(document.getElementById("balance").textContent, 10);
            balance += 5000;  // Add 5000 coins for completing the task

            document.getElementById("balance").textContent = balance;
            saveUserDataToCookies(balance, document.getElementById("energy").textContent);

            alert(`${taskName} completed! 5000 coins added to balance.`);

            // Mark task as completed and update UI
            markTaskCompleted(taskId);
            updateTaskButton(taskId, taskName);
        }, 5000);  // Simulate task completion after 5 seconds
    } else {
        alert(`${taskName} has already been completed.`);
    }
}

// Task actions
document.getElementById('follow-twitter-task').addEventListener('click', () => {
    window.open('https://twitter.com', '_blank');
    completeTask('follow-twitter-task', 'Twitter Follow');
});

document.getElementById('join-telegram-task').addEventListener('click', () => {
    window.open('https://t.me', '_blank');
    completeTask('join-telegram-task', 'Telegram Join');
});

// Energy refuel timer
function getRemainingTime() {
    const savedTime = localStorage.getItem('lastEnergyRefillTime');
    const currentTime = Date.now();
    
    if (savedTime) {
        const elapsedTime = Math.floor((currentTime - parseInt(savedTime, 10)) / 1000); // Elapsed time in seconds
        return Math.max(0, 600 - elapsedTime); // 10 minutes = 600 seconds, calculate remaining time
    }
    return 600; // Full 10 minutes if no time saved
}

function startEnergyRefillTimer() {
    const timerElement = document.getElementById('timer');
    let remainingTime = getRemainingTime();

    const updateTimer = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        timerElement.textContent = `Energy refuels in: ${minutes}m ${seconds}s`;

        if (remainingTime > 0) {
            remainingTime--;
        } else {
            clearInterval(timerInterval);
            document.getElementById('energy').textContent = '500/500'; // Reset energy
            localStorage.removeItem('lastEnergyRefillTime'); // Remove the time when refill completes
            timerElement.textContent = "Energy fully refueled!";
        }
    };

    if (remainingTime > 0) {
        const timerInterval = setInterval(updateTimer, 1000); // Update every second
    } else {
        document.getElementById('energy').textContent = '500/500'; // Reset energy immediately if no time remains
        timerElement.textContent = "Energy fully refueled!";
    }
}

// Initialize event listeners for navigation tabs
document.getElementById('earn-tab').addEventListener('click', () => {
    document.getElementById('earn-section').style.display = 'block';
    document.getElementById('tasks-section').style.display = 'none';
});

document.getElementById('tasks-tab').addEventListener('click', () => {
    document.getElementById('tasks-section').style.display = 'block';
    document.getElementById('earn-section').style.display = 'none';
});

// Initial load
window.addEventListener('load', () => {
    loadUserDataFromCookies();  // Load user data from cookies on page load
    startEnergyRefillTimer();  // Start the energy refuel timer

    // Check task status and update UI on load
    updateTaskButton('follow-twitter-task', 'Twitter Follow');
    updateTaskButton('join-telegram-task', 'Telegram Join');

    const savedTime = localStorage.getItem('lastEnergyRefillTime');
    if (!savedTime) {
        // Save the current timestamp if no saved time
        localStorage.setItem('lastEnergyRefillTime', Date.now());
    }
    startEnergyRefillTimer();  // Start the energy refill timer
});
