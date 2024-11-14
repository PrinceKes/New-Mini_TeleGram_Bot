document.addEventListener("DOMContentLoaded", function() {

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');

// Assuming you have an API or a method to get the avatar URL based on the user ID
const avatarUrl = "https://example.com/path/to/avatar.png"; 

if (userId) {
    updateHeader(userId, avatarUrl);
} else {
    const userIdElement = document.getElementById('userId');
    if (userIdElement) {
        userIdElement.innerText = "User ID Unknown";
    }
}


    // Navbar loading
    fetch('navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
        })
        .catch(error => console.error('Error loading navbar:', error));


    // Welcome bonus logic
    const pointsElement = document.getElementById("points");

    let points = localStorage.getItem("userPoints");

    if (points === null) {
        const hasClaimedBonus = localStorage.getItem("hasClaimedBonus");

        if (!hasClaimedBonus) {

            setTimeout(() => {
                alert("Welcome! Claim your 2000 Roast as a welcome bonus!");

                points = 2000;
                pointsElement.innerText = `${points} Roast`;

                localStorage.setItem("hasClaimedBonus", "true");
                localStorage.setItem("userPoints", points);
            }, 1000);
        } else {
            points = 0;
            pointsElement.innerText = `${points} Roast`;
            localStorage.setItem("userPoints", points);
        }
    } else {
        
        pointsElement.innerText = `${points} Roast`;
    }
});



// Ensure that TON Connect is initialized once the DOM is fully loaded
alert("JavaScript loaded");
document.addEventListener("DOMContentLoaded", async function() {
    // Initialize TON Connect
    const tonConnect = new TonConnect({
        manifestUrl: 'https://new-mini-telegram-bot.onrender.com/tonconnect-manifest.json' // Update with your manifest URL
    });

    const walletButton = document.querySelector(".wallet-btn");

    // Check if a wallet is already connected
    const connectedWalletAddress = localStorage.getItem("walletAddress");
    if (connectedWalletAddress) {
        walletButton.innerText = `${connectedWalletAddress.slice(0, 4)}...${connectedWalletAddress.slice(-4)}`;
    }

    // Handle wallet connection
    walletButton.addEventListener("click", async () => {
        console.log("Button clicked");  // Confirm the button click in the console
        alert("Button clicked");  // Optional alert for button click

        try {
            // Open the wallet connection prompt
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
