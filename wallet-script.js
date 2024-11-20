
// Ensure that TON Connect is initialized once the DOM is fully loaded

document.addEventListener("DOMContentLoaded", async function() {
    const tonConnect = new TonConnect({
        manifestUrl: 'https://new-mini-telegram-bot.onrender.com/tonconnect-manifest.json' // Update with your manifest URL
    });

    const walletButton = document.querySelector(".wallet-btn");

    const connectedWalletAddress = localStorage.getItem("walletAddress");
    if (connectedWalletAddress) {
        walletButton.innerText = `${connectedWalletAddress.slice(0, 4)}...${connectedWalletAddress.slice(-4)}`;
    }

    walletButton.addEventListener("click", async () => {
        console.log("Button clicked");  
        alert("Button clicked");  

        try {
            const walletInfo = await tonConnect.connect();

            if (walletInfo) {
                const walletAddress = walletInfo.address;
                localStorage.setItem("walletAddress", walletAddress);
                walletButton.innerText = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
                console.log("Wallet connected:", walletAddress);
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Failed to connect to the wallet. Please try again.");
        }
    });
});
