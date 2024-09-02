async function connectTonWallet() {
    try {
        const tonWallet = window.ton || {}; // Replace with actual TON wallet SDK initialization
        if (!tonWallet.isTonWallet) {
            alert("Please install TON Wallet!");
            return;
        }
        const address = await tonWallet.request({ method: 'ton_requestAccounts' });
        if (address) {
            alert("Connected to TON Wallet: " + address);
            document.getElementById('connect-ton-wallet').textContent = address;
        } else {
            alert("Failed to connect TON Wallet.");
        }
    } catch (error) {
        console.error("Error connecting to TON Wallet:", error);
        alert("Error connecting to TON Wallet. Check console for details.");
    }
}

document.getElementById('connect-ton-wallet').addEventListener('click', connectTonWallet);