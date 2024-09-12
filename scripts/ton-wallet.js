// Import the TonConnect SDK (if using a module bundler)
import { TonConnectUI, TonConnect } from "@tonconnect/ui";

// Initialize TON Connect and UI
const tonConnect = new TonConnect();
const tonConnectUI = new TonConnectUI(tonConnect, {
    // Specify required permissions here if needed
    bridgeUrl: 'https://bridge.tonconnect.dev',
    manifestUrl: 'https://layerzerosybil.vercel.app/tonconnect-manifest.json'
});

// Function to connect TON Wallet
async function connectTonWallet() {
    try {
        // Opens the TON Connect wallet selection UI
        const selectedWallet = await tonConnectUI.connectWallet();

        // Check if wallet was selected
        if (selectedWallet) {
            const address = selectedWallet.account.address;
            document.getElementById('connect-ton-wallet').textContent = address;
            alert("Connected to TON Wallet: " + address);
        } else {
            alert("No wallet selected");
        }
    } catch (error) {
        console.error("Error connecting to TON Wallet:", error);
        alert("Error connecting to TON Wallet. Check console for details.");
    }
}

// Add event listener for the Connect Wallet button
document.getElementById('connect-ton-wallet').addEventListener('click', connectTonWallet);
