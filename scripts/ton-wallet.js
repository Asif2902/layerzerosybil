// Initialize TON Connect
const tonConnect = new TonConnect({
    manifestUrl: 'https://layerzerosybil.vercel.app/tonconnect-manifest.json' // Replace with your manifest URL
});

// Select the "Connect Wallet" button
const connectButton = document.getElementById("connect-ton-wallet");

// Handle wallet connection
connectButton.addEventListener("click", async () => {
    try {
        // Prompt user to connect wallet
        const connection = await tonConnect.connectWallet();
        if (connection) {
            console.log('Wallet connected:', connection);

            // Update button text to show wallet address
            connectButton.textContent = `Connected: ${connection.walletAddress}`;

            // You can also display the balance if you fetch it
            // For example:
            const balance = await tonConnect.getBalance(connection.walletAddress);
            document.getElementById('balance').textContent = balance + ' TON';
        }
    } catch (error) {
        console.error('Connection failed', error);
    }
});

// Disconnect logic (if needed)
function disconnectWallet() {
    tonConnect.disconnect();
    connectButton.textContent = 'Connect Wallet';
    document.getElementById('balance').textContent = '0';
}
