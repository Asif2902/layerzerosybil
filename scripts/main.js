document.addEventListener('DOMContentLoaded', function() {
    // Initial Setup
    let balance = parseInt(getCookie('tokenBalance')) || 0;
    let energy = parseInt(getCookie('energy')) || 500;

    document.getElementById('balanceDisplay').innerText = balance;
    document.getElementById('energyDisplay').innerText = `${energy}/500`;

    // Tap-to-Unbox Event
    document.getElementById('unboxButton').addEventListener('click', function() {
        if (energy > 0) {
            balance += 1;
            energy -= 1;

            setCookie('tokenBalance', balance, 1);
            setCookie('energy', energy, 1);

            document.getElementById('balanceDisplay').innerText = balance;
            document.getElementById('energyDisplay').innerText = `${energy}/500`;

            saveUserData(balance, energy);
        } else {
            alert('No energy left! Wait for regeneration.');
        }
    });

    // Task Completion Event
    document.getElementById('taskButton').addEventListener('click', function() {
        if (!getCookie('taskCompleted')) {
            balance += 5000;

            setCookie('tokenBalance', balance, 1);
            setCookie('taskCompleted', true, 1);

            document.getElementById('balanceDisplay').innerText = balance;
            alert('Task completed! You earned 5,000 coins.');
        } else {
            alert('Task already completed!');
        }
    });

    // Connect Wallet Event (Mock)
    document.getElementById('connectWallet').addEventListener('click', function() {
        const walletAddress = "0xYourWalletAddress";
        if (walletAddress) {
            setCookie('walletAddress', walletAddress, 1);
            alert('Wallet connected!');
            saveUserData(balance, energy, walletAddress);
        } else {
            alert('Address not found.');
        }
    });

    // Connect Telegram for Airdrop Event (Mock)
    document.getElementById('airdropButton').addEventListener('click', function() {
        const tgUserId = "12345678"; // Example Telegram User ID
        if (tgUserId) {
            setCookie('tgUserId', tgUserId, 1);
            alert('Telegram connected! Ready for airdrops.');
        } else {
            alert('Telegram not connected.');
        }
    });

    // Save User Data to a Text File (Server-Side Simulation)
    function saveUserData(balance, energy, walletAddress = '') {
        const tgUserId = getCookie('tgUserId') || 'UnknownUser';
        const data = `User ID: ${tgUserId}\nBalance: ${balance}\nEnergy: ${energy}\nWallet: ${walletAddress}\n`;
        console.log(data); // Replace this with an API call to save data to the server
    }

    // Cookie Functions
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});
function saveUserData(balance, energy, walletAddress = '') {
    const tgUserId = getCookie('tgUserId') || 'UnknownUser';
    const data = {
        tgUserId: tgUserId,
        balance: balance,
        energy: energy,
        walletAddress: walletAddress
    };

    fetch('/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(data => {
        console.log(data); // Response from server
    }).catch(error => {
        console.error('Error saving data:', error);
    });
}
