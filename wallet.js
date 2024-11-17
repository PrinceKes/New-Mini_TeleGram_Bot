document.addEventListener("DOMContentLoaded", async () => {
    const walletButton = document.querySelector(".wallet-btn");
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    
    // Function to fetch or store wallet data
    async function fetchWalletAddress(userId) {
        try {
            const response = await fetch(`http://localhost:5000/api/wallet/${userId}`);
            const data = await response.json();
            return data.walletAddress;
        } catch (error) {
            console.error("Error fetching wallet address:", error);
            return null;
        }
    }

    async function saveWalletAddress(userId, walletAddress) {
        try {
            const response = await fetch(`http://localhost:5000/api/wallet/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress }),
            });
            return response.ok;
        } catch (error) {
            console.error("Error saving wallet address:", error);
        }
    }

    // Check for existing wallet address
    let walletAddress = await fetchWalletAddress(userId);

    if (walletAddress) {
        updateWalletButton(walletAddress);
    } else {
        walletButton.addEventListener("click", async () => {
            try {
                const tg = window.Telegram.WebApp;
                tg.ready(); // Initialize Telegram WebApp
                tg.expand(); // Expand view if needed
                const result = await tg.invokeMethod("connect_wallet"); // Use Telegram's wallet method
                walletAddress = result.walletAddress;

                if (walletAddress) {
                    await saveWalletAddress(userId, walletAddress);
                    updateWalletButton(walletAddress);
                } else {
                    alert("Failed to connect wallet!");
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
                alert("An error occurred while connecting the wallet.");
            }
        });
    }

    function updateWalletButton(walletAddress) {
        const first4 = walletAddress.substring(0, 4);
        const last4 = walletAddress.slice(-4);
        walletButton.textContent = `Wallet: ${first4}...${last4}`;
        walletButton.disabled = true; // Disable button after wallet is connected
    }
});


// Update your script.js to properly initialize TonConnect:

document.addEventListener("DOMContentLoaded", async function () {
    const connector = new TonConnect();
    
    document.querySelector('.wallet-btn').addEventListener('click', async function () {
        try {
            const result = await connector.connect();
            const walletAddress = result.account.address;
            alert(`Connected: ${walletAddress}`);

            // Save the wallet address in the database
            await fetch(`http://localhost:5000/api/wallet/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletAddress }),
            });

            // Update the button text
            document.querySelector('.wallet-btn').innerText =
                `🔗 ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
        } catch (error) {
            console.error('Wallet connection failed:', error);
            alert('An error occurred while connecting the wallet.');
        }
    });
});

