// Helper functions to set and get cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// Load user data and cookies
async function loadUserData() {
    try {
        const userId = await getTelegramUserId();
        const response = await fetch(`/api/loadData?userId=${userId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load user data');
        }

        const userData = await response.json();
        
        // Update UI with fetched data
        if (userData) {
            document.getElementById("balance").textContent = getCookie('balance') || userData.balance || 0;
            document.getElementById("energy").textContent = getCookie('energy') || userData.energy || "500/500";
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Save user data and cookies
async function saveUserData(balance, energy) {
    const userId = await getTelegramUserId();
    const data = { userId, balance, energy };

    try {
        await fetch('/api/saveData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Save to cookies
        setCookie('balance', balance, 7);
        setCookie('energy', energy, 7);

    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// Handle task completion
async function completeTask(taskId, taskName) {
    document.getElementById(taskId).disabled = true;

    setTimeout(async () => {
        let balance = parseInt(document.getElementById("balance").textContent, 10);
        balance += 5000;

        document.getElementById("balance").textContent = balance;
        await saveUserData(balance, parseInt(document.getElementById("energy").textContent.split('/')[0], 10));

        alert(`${taskName} completed! 5000 coins added to balance.`);
    }, 5000);
}

// Follow Twitter Task
document.getElementById('follow-twitter-task').addEventListener('click', () => {
    window.open('https://twitter.com', '_blank');
    completeTask('follow-twitter-task', 'Twitter Follow');
});

// Join Telegram Task
document.getElementById('join-telegram-task').addEventListener('click', () => {
    window.open('https://t.me', '_blank');
    completeTask('join-telegram-task', 'Telegram Join');
});

// Energy refuel timer
function startEnergyRefuelTimer() {
    let energy = parseInt(document.getElementById("energy").textContent.split('/')[0], 10);

    if (energy < 500) {
        let refuelTime = 10 * 60 * 1000; // 10 minutes to refuel to full
        let timeLeft = refuelTime;

        const timer = setInterval(() => {
            timeLeft -= 1000;
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
            document.getElementById("energy-refuel-timer").textContent = `${minutes}m ${seconds}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById("energy").textContent = "500/500";
                saveUserData(parseInt(document.getElementById("balance").textContent, 10), 500);
                document.getElementById("energy-refuel-timer").textContent = "Energy fully refueled!";
            }
        }, 1000);
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
window.addEventListener('load', async () => {
    await loadUserData();
    startEnergyRefuelTimer();
});
