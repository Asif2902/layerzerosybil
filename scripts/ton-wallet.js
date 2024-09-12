// Import the TonConnect SDK (only needed if using a build tool)
import { TonConnect } from "@tonconnect/sdk";

// Initialize TonConnect instance
const tonConnect = new TonConnect({
    manifestUrl: "https://layerzerosybil.vercel.app/tonconnect-manifest.json" // Replace with your actual manifest file URL
});

// Manifest setup in JSON (required by TON Connect)
const manifest = {
    url: "https://layerzerosybil.vercel.app", // Your dApp URL
    name: "TapSwap",
    icons: ["https://layerzerosybil.vercel.app/assets/logo.png"], // Replace with your actual icon URL
};

// Function to connect to TON Wallet
async function connectTonWallet() {
    try {
        // Open the connection dialog (users will select their wallet)
        const walletsList = await tonConnect.getWallets();
        
        if (walletsList.length > 0) {
            await tonConnect.connect({ universalLink: walletsList[0].universalLink });
        }

        const connectedWallet = tonConnect.wallet;
        
        if (connectedWallet) {
            const address = connectedWallet.account.address;
            document.getElementById('connect-ton-wallet').textContent = address;
            alert("Connected to TON Wallet: " + address);
        } else {
            alert("No wallet connected");
        }
    } catch (error) {
        console.error("Error connecting to TON Wallet:", error);
        alert("Error connecting to TON Wallet. Check console for details.");
    }
}

// Add event listener to the Connect button
document.getElementById('connect-ton-wallet').addEventListener('click', connectTonWallet);
