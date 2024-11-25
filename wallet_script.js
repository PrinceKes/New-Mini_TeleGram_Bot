// Initialize TonConnect
const tonConnect = new TonConnect({
    manifestUrl: "https://new-mini-telegram-bot.onrender.com/tonconnect-manifest.json",
  });
  
  // Wallet Connect Button Logic
  const connectWallet = async () => {
    try {
      // Trigger wallet connection
      await tonConnect.connectWallet();
      
      // Fetch the wallet details
      const connectedWallet = tonConnect.wallet;
  
      if (connectedWallet) {
        const walletAddress = connectedWallet.account.address;
        console.log("Connected Wallet Address:", walletAddress);
  
        // Update the button to display the wallet address
        const walletButton = document.querySelector(".wallet-connect-btn");
        walletButton.innerText = `Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
      } else {
        console.error("Wallet connection failed.");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };
  
  // Add Event Listener to the Button
  document.querySelector(".wallet-connect-btn").addEventListener("click", connectWallet);
  




// document.addEventListener("DOMContentLoaded", () => {
//     const connectWalletButton = document.querySelector(".wallet-btn");
//     let userWalletAddress = ""; // Placeholder for the user's wallet address
  
//     // Modal setup
//     const modalHTML = `
//       <div id="connect-wallet-modal" class="modal hidden">
//         <div class="modal-content">
//           <h2>Connect Your Wallet</h2>
//           <p>Select the wallet you'd like to connect:</p>
//           <button id="open-wallet-btn" class="claim-btn">Open Wallet in Telegram</button>
//         </div>
//       </div>
//       <div id="confirm-wallet-modal" class="modal hidden">
//         <div class="modal-content">
//           <h2>Authorize Access</h2>
//           <p>Please approve access to your wallet:</p>
//           <div id="wallet-info">
//             <strong>Wallet: GrandCombat</strong>
//             <p id="wallet-address-display">TON Space UQDB...4MTK</p>
//           </div>
//           <button id="authorize-wallet-btn" class="claim-btn">Authorize Wallet</button>
//         </div>
//       </div>
//     `;
  
//     document.body.insertAdjacentHTML("beforeend", modalHTML);
  
//     const connectWalletModal = document.getElementById("connect-wallet-modal");
//     const confirmWalletModal = document.getElementById("confirm-wallet-modal");
//     const walletAddressDisplay = document.getElementById("wallet-address-display");
//     const openWalletButton = document.getElementById("open-wallet-btn");
//     const authorizeWalletButton = document.getElementById("authorize-wallet-btn");
  
//     // Show connect wallet modal
//     connectWalletButton.addEventListener("click", () => {
//       connectWalletModal.classList.remove("hidden");
//     });
  
//     // Open wallet functionality
//     openWalletButton.addEventListener("click", () => {
//       connectWalletModal.classList.add("hidden");
//       confirmWalletModal.classList.remove("hidden");
//       // Simulate wallet address retrieval (Replace this with actual TON Wallet integration)
//       userWalletAddress = "TON Space UQDB...4MTK";
//       walletAddressDisplay.textContent = userWalletAddress;
//     });
  
//     // Authorize wallet functionality
//     authorizeWalletButton.addEventListener("click", () => {
//       confirmWalletModal.classList.add("hidden");
  
//       // Update the button to show connected wallet address
//       connectWalletButton.textContent = userWalletAddress;
//       connectWalletButton.disabled = true;
  
//       // Store the wallet address (replace with your backend integration)
//       console.log("Wallet connected:", userWalletAddress);
  
//       // Optionally, save the wallet address in local storage
//       localStorage.setItem("userWalletAddress", userWalletAddress);
//     });
  
//     // Close modals if clicked outside content
//     window.addEventListener("click", (event) => {
//       if (event.target === connectWalletModal) {
//         connectWalletModal.classList.add("hidden");
//       }
//       if (event.target === confirmWalletModal) {
//         confirmWalletModal.classList.add("hidden");
//       }
//     });
  
//     // Load wallet address from local storage on page load
//     const savedWalletAddress = localStorage.getItem("userWalletAddress");
//     if (savedWalletAddress) {
//       userWalletAddress = savedWalletAddress;
//       connectWalletButton.textContent = userWalletAddress;
//       connectWalletButton.disabled = true;
//     }
//   });
  