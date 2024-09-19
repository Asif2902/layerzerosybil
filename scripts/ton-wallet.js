
const tonConnectUI = new TonConnectUI({
  manifestUrl: "https://layerzerosybil.vercel.app/tonconnect-manifest.json",
  buttonRootId: "<connect-ton-wallet>",
  /**
   * Add custom wallet to wallets list
   */
  walletsListConfiguration: {
    includeWallets: [
      {
        name: "Bitget Wallet",
        appName: "bitgetTonWallet",
        imageUrl:
          "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget%20wallet_logo_iOS.png",
        deepLink: "bitkeep://",
        universalLink: "https://bkcode.vip/ton-connect",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
        platforms: ["ios", "android", "chrome"],
      },
    ],
  },
  // connector: "your tonConnect instance",
  //...
});

//Change options if needed
tonConnectUI.uiOptions = {
  language: "en",
  uiPreferences: {
    theme: THEME.DARK,
  },
};

//Get wallet list
const walletsList = await tonConnectUI.getWallets();
/* walletsList is 
{
    name: string;
    imageUrl: string;
    tondns?: string;
    aboutUrl: string;
    universalLink?: string;
    deepLink?: string;
    bridgeUrl?: string;
    jsBridgeKey?: string;
    injected?: boolean; // true if this wallet is injected to the webpage
    embedded?: boolean; // true if the dapp is opened inside this wallet's browser
}[] 
 */

//Open wallet selection list
await tonConnectUI.openModal();

//Close wallet selection list
tonConnectUI.closeModal();

//Get the current modal status
const currentModalState = tonConnectUI.modalState;

//Subscribe to modal window state changes
const unsubscribeModal = tonConnectUI.onModalStateChange(
  (state: WalletsModalState) => {
    // update state/reactive variables to show updates in the ui
    // state.status will be 'opened' or 'closed'
    // if state.status is 'closed', you can check state.closeReason to find out the reason
  }
);

//Specify the connection wallet
await tonConnectUI.openSingleWalletModal("bitgetTonWallet");

tonConnectUI.closeSingleWalletModal();

const unsubscribe = tonConnectUI.onSingleWalletModalStateChange((state) => {
  console.log("Modal state changed:", state);
});

// Call `unsubscribe` when you want to stop listening to the state changes
unsubscribe();

//Get the currently connected Wallet and WalletInfo
const currentWallet = tonConnectUI.wallet;
const currentWalletInfo = tonConnectUI.walletInfo;
const currentAccount = tonConnectUI.account;
const currentIsConnectedStatus = tonConnectUI.connected;

//Subscribe to connection status changes
const unsubscribe = tonConnectUI.onStatusChange((walletAndwalletInfo) => {
  // update state/reactive variables to show updates in the ui
});

//disconnect
await tonConnectUI.disconnect();
