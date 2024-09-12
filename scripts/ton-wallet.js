// Import the TonConnect SDK
import TonConnect from "@tonconnect/sdk";

// Initialize the TonConnect instance
const tonConnect = new TonConnect();

// Load wallet connection
async function connectTonWallet() {
    try {
        // Opens TON Connect modal for user to choose wallet
        const connectionResponse = await tonConnect.connectWallet({
            universalLink: 'ton://',  // TON Connect universal link
            bridgeUrl: 'https://bridge.tonconnect.dev'  // Public bridge URL (as per TON docs)
        });

        if (connectionResponse) {
            // Successfully connected
            const address = connectionResponse.account.address;
            alert("Connected to TON Wallet: " + address);
            document.getElementById('connect-ton-wallet').textContent = address;
        } else {
            alert("Connection failed.");
        }
    } catch (error) {
        console.error("Error connecting to TON Wallet:", error);
        alert("Error connecting to TON Wallet. Check console for details.");
    }
}

// Add event listener for the Connect Wallet button
document.getElementById('connect-ton-wallet').addEventListener('click', connectTonWallet);
