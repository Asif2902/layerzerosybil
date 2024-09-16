// Initialize TON Connect
const tonConnect = new TonConnect({
    manifestUrl: 'https://layerzerosybil.vercel.app/tonconnect-manifest.json' // Replace with your hosted manifest file URL
});

// Select the "Connect Wallet" button
const connectButton = document.getElementById("connect-ton-wallet");

// Handle wallet connection
connectButton.addEventListener("click", async () => {
    try {
        const isConnected = tonConnect.wallet;
        if (isConnected) {
            console.log('Wallet already connected:', isConnected);

            // Update button text to show wallet address
            connectButton.textContent = `Connected: ${isConnected.account.address}`;
            return;
        }

        // Prompt user to connect wallet
        const wallet = await tonConnect.connectWallet();
        if (wallet) {
            console.log('Wallet connected:', wallet);

            // Update button text to show wallet address
            connectButton.textContent = `Connected: ${wallet.account.address}`;

            // Optionally, you can also fetch and display the user's balance
            const balance = await tonConnect.getBalance(wallet.account.address);
            document.getElementById('balance').textContent = balance + ' TON';
        }
    } catch (error) {
        console.error('Connection failed', error);
    }
});

// Optionally add disconnect logic
function disconnectWallet() {
    tonConnect.disconnect();
    connectButton.textContent = 'Connect Wallet';
    document.getElementById('balance').textContent = '0';
}
