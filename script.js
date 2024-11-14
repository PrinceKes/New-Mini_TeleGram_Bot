document.addEventListener("DOMContentLoaded", function() {

    // Fetch user ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    const userIdElement = document.getElementById('userId');
    if (userIdElement) {
        userIdElement.innerText = userId ? `User ID: ${userId}` : "User ID not available";
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
                alert("Welcome! Claim your 2000 PAWS as a welcome bonus!");

                points = 2000;
                pointsElement.innerText = `${points} PAWS`;

                localStorage.setItem("hasClaimedBonus", "true");
                localStorage.setItem("userPoints", points);
            }, 1000);
        } else {
            points = 0;
            pointsElement.innerText = `${points} PAWS`;
            localStorage.setItem("userPoints", points);
        }
    } else {
        
        pointsElement.innerText = `${points} PAWS`;
    }
});



// function to connect wallet
document.addEventListener("DOMContentLoaded", function() {
    // Initialize TON Connect
    const tonConnect = new TonConnect();

    const walletButton = document.querySelector(".wallet-btn");

    // Check if a wallet is already connected
    const connectedWalletAddress = localStorage.getItem("walletAddress");
    if (connectedWalletAddress) {
        walletButton.innerText = `${connectedWalletAddress.slice(0, 4)}...${connectedWalletAddress.slice(-4)}`;
    }

    // Handle wallet connection
    walletButton.addEventListener("click", async () => {
        try {
            const walletInfo = await tonConnect.connectWallet();

            if (walletInfo) {
                // Save the wallet address to local storage
                const walletAddress = walletInfo.address;
                localStorage.setItem("walletAddress", walletAddress);

                // Update the button text to show the first and last 4 characters of the address
                walletButton.innerText = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Failed to connect to the wallet. Please try again.");
        }
    });
});






//     // Fetch user ID from URL query parameter

// document.addEventListener("DOMContentLoaded", function() {

//     const urlParams = new URLSearchParams(window.location.search);
//     const userId = urlParams.get('user_id');

//     const userIdElement = document.getElementById('userId');
//     if (userIdElement) {
//         userIdElement.innerText = userId ? `User ID: ${userId}` : "User ID not available";
//     }
// });


// // function that controls navbar

// fetch('navbar.html')
//     .then(response => response.text())
//     .then(html => {
//         document.getElementById('navbar-container').innerHTML = html;
//     })
//     .catch(error => console.error('Error loading navbar:', error));



//     document.addEventListener("DOMContentLoaded", function() {
//         // Fetch user ID from URL query parameter
//         const urlParams = new URLSearchParams(window.location.search);
//         const userId = urlParams.get('user_id');
  
//         // Update User ID in the header
//         if (userId) {
//           document.getElementById('userId').innerText = `User ID: ${userId}`;
//         } else {
//           document.getElementById('userId').innerText = "User ID not available";
//         }
  
//         // Welcome bonus logic
//         const pointsElement = document.getElementById("points");
        
//         // Check if user has claimed the welcome bonus before
//         const hasClaimedBonus = localStorage.getItem("hasClaimedBonus");
  
//         if (!hasClaimedBonus) {
//           // Alert the user about the welcome bonus
//           setTimeout(() => {
//             alert("Welcome! Claim your 2000 PAWS as a welcome bonus!");
            
//             // Update points to reflect the welcome bonus
//             pointsElement.innerText = "2000 PAWS";
  
//             // Store that the user has claimed the bonus to avoid repeated alerts
//             localStorage.setItem("hasClaimedBonus", "true");
//           }, 1000);
//         } else {
//           // Set points to 0 or existing points if not the first time
//           pointsElement.innerText = "0 PAWS";
//         }
//      });