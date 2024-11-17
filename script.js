document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('user_id'); // Extract user_id from URL
    const storedUserId = localStorage.getItem('user_id'); // Retrieve stored user_id from localStorage
    const userIdElement = document.getElementById('userId');
  
    let userId = userIdFromUrl || storedUserId;
  
    if (userId) {
      // Store the user ID in localStorage for future reference
      localStorage.setItem('user_id', userId);
  
      // Update the header with the user ID
      const avatarUrl = "../assets/Avatar.png"; // Replace with dynamic avatar retrieval if necessary
      updateHeader(userId, avatarUrl);
  
      // Save the user ID to MongoDB if this is the first visit
      if (userIdFromUrl) {
        saveUserIdToDatabase(userId);
      }
    } else {
      if (userIdElement) {
        userIdElement.innerText = "User ID: Unknown";
      }
    }
  });
  
  // Function to update the header with the user ID and avatar
  function updateHeader(userId, avatarUrl) {
    const userIdElement = document.getElementById('userId');
    const avatarElement = document.querySelector(".header img");
  
    if (userIdElement) {
      userIdElement.innerText = `User ID: ${userId}`;
    }
  
    if (avatarElement && avatarUrl) {
      avatarElement.src = avatarUrl;
    }
  }
  
  // Function to save the user ID to the database via API
  function saveUserIdToDatabase(userId) {
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
      .then(response => response.json())
      .then(data => console.log('User ID saved:', data))
      .catch(error => console.error('Error saving user ID:', error));
  }
  














// Navbar loading and active tab handling
// Navbar loading and active tab handling
fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar-container').innerHTML = html;

        const currentPath = window.location.pathname.split('/').pop();
        const navItems = document.querySelectorAll('.bottom-nav-item');

        navItems.forEach(item => {
            if (item.getAttribute('href').includes(currentPath)) {
                item.classList.add('active');
            }
        });
    })
    .catch(error => console.error('Error loading navbar:', error));


    // // Function to load screen animation

    // document.addEventListener('DOMContentLoaded', () => {
    //     const loadingScreen = document.getElementById('loading-screen');
    //     const contentContainer = document.getElementById('content'); // The container where pages will be loaded
    
    //     // Function to show the loading screen
    //     function showLoading() {
    //         console.log('Showing loading screen...');
    //         loadingScreen.style.display = 'flex'; // Display the loading screen
    //     }
    
    //     // Function to hide the loading screen after 3 seconds
    //     function hideLoading() {
    //         console.log('Hiding loading screen after delay...');
    //         setTimeout(() => {
    //             loadingScreen.style.display = 'none'; // Hide the loading screen after 3 seconds
    //         }, 3000); // 3000ms = 3 seconds
    //     }
    
    //     // Function to load a new page
    //     function loadPage(pageUrl) {
    //         console.log('Loading page:', pageUrl);
    //         showLoading(); // Show the loading screen before fetching the page
    
    //         // Fetch the page content
    //         fetch(pageUrl)
    //             .then(response => response.text())
    //             .then(html => {
    //                 console.log('Page loaded successfully');
    //                 contentContainer.innerHTML = html; // Replace the content with the new page
    //             })
    //             .catch(error => {
    //                 console.error('Error loading page:', error);
    //                 contentContainer.innerHTML = `<p>Error loading page.</p>`; // Display error message if fetch fails
    //             })
    //             .finally(() => {
    //                 hideLoading(); // Hide the loading screen after the page loads, with the 3-second delay
    //             });
    //     }
    
    //     // Attach click event to navbar links for navigation
    //     document.querySelectorAll('nav a').forEach(link => {
    //         link.addEventListener('click', event => {
    //             event.preventDefault(); // Prevent default navigation behavior
    //             const pageUrl = event.target.getAttribute('href');
    //             console.log('Navbar link clicked:', pageUrl);
    //             loadPage(pageUrl); // Load the clicked page
    //         });
    //     });
    
    //     // Initially load the default page (e.g., index.html)
    //     loadPage('index.html');
    // });
    
      













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
// });






// functions to update user balance base on the tasks they do

document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('points');
    const savedBalance = localStorage.getItem('userBalance') || '0';
    balanceElement.textContent = `${savedBalance} Roast`;
  });
  





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





