document.addEventListener('DOMContentLoaded', function() {
    const coin = document.getElementById('coin');
    const tapToUn = document.getElementById('tap-to-un');
    const taskButton = document.getElementById('task-button');
    const adoptButton = document.getElementById('adopt-button');

    const userID = 'user123'; // Example User ID, this should be dynamic
    let tokenBalance = 1000;  // Example starting balance, this should be loaded from a file
    let energy = 1;           // Starting energy
    const ENERGY_REGEN_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    // Load balance and last energy generation time from cookies
    const savedBalance = getCookie('tokenBalance');
    const lastEnergyGen = getCookie('lastEnergyGenTime');
    tokenBalance = savedBalance ? parseInt(savedBalance) : tokenBalance;

    // Check if 12 hours have passed since the last energy generation
    if (lastEnergyGen) {
        const timeElapsed = Date.now() - parseInt(lastEnergyGen);
        if (timeElapsed >= ENERGY_REGEN_TIME) {
            energy++;
            setCookie('lastEnergyGenTime', Date.now(), 7);
        }
    } else {
        setCookie('lastEnergyGenTime', Date.now(), 7);
    }

    updateBalanceDisplay();

    // Coin click event
    coin.addEventListener('click', function() {
        if (tokenBalance > 0 && energy > 0) {
            tokenBalance--;
            energy--;
            setCookie('tokenBalance', tokenBalance, 7);
            setCookie('lastEnergyGenTime', Date.now(), 7); // Reset energy generation timer
            updateBalanceDisplay();
            saveUserData(userID, tokenBalance);
        } else {
            alert('No energy left!');
        }
    });

    // Task button event
    taskButton.addEventListener('click', function() {
        tokenBalance += 5000;
        setCookie('tokenBalance', tokenBalance, 7);
        updateBalanceDisplay();
        saveUserData(userID, tokenBalance);
    });

    // Adopt button event
    adoptButton.addEventListener('click', function() {
        if (isTelegramConnected()) {
            // Implement adopt logic here
        } else {
            alert('Please connect your Telegram wallet.');
        }
    });

    // Update balance display
    function updateBalanceDisplay() {
        tapToUn.textContent = `Balance: ${tokenBalance}, Energy: ${energy}`;
    }

    // Save user data
    function saveUserData(id, balance) {
        fetch('/api/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, balance })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    // Simple cookie management functions
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

    function isTelegramConnected() {
        // Placeholder function, implement Telegram connection check here
        return true;
    }
});