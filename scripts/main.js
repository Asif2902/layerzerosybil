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
            document.getElementById("balance").textContent = userData.balance || 0;
            document.getElementById("energy").textContent = userData.energy || "500/500";
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function getTelegramUserId() {
    try {
        const tg = window.Telegram.WebApp;
        const userId = tg.initDataUnsafe?.user?.id;

        if (!userId) {
            throw new Error('Telegram User ID not found');
        }

        return userId;
    } catch (error) {
        console.error('Error fetching Telegram user ID:', error);
        return null;
    }
}

async function saveUserData(balance, energy) {
    const userId = await getTelegramUserId();
    const data = { userId, balance, energy };

    try {
        await fetch('/api/saveData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

document.getElementById('coin').addEventListener('click', async () => {
    let balance = parseInt(document.getElementById("balance").textContent, 10);
    let energy = parseInt(document.getElementById("energy").textContent.split('/')[0], 10);

    if (energy > 0) {
        balance += 1;
        energy -= 1;

        document.getElementById("balance").textContent = balance;
        document.getElementById("energy").textContent = `${energy}/500`;

        await saveUserData(balance, energy);
    } else {
        alert("No energy left. Please wait for regeneration.");
    }
});

async function completeTask(taskId) {
    let balance = parseInt(document.getElementById("balance").textContent, 10);
    balance += 5000;

    document.getElementById("balance").textContent = balance;
    document.getElementById(taskId).disabled = true;

    await saveUserData(balance, parseInt(document.getElementById("energy").textContent.split('/')[0], 10));
}

document.getElementById('airdrop').addEventListener('click', async () => {
    // Implement TON Wallet connection
    alert("TON Wallet connection coming soon!");
});

// Initial load
window.addEventListener('load', async () => {
    await loadUserData();
});