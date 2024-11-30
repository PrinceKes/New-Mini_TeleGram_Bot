// Select the popup element and the cancel button
const sendTransactionPopup = document.querySelector('.SendTransction');
const cancelButton = document.querySelector('.bin');

const showPopupOnLoad = () => {
    sendTransactionPopup.style.display = "block";
};

const hidePopup = () => {
    sendTransactionPopup.style.display = "none";
};

window.onload = showPopupOnLoad;

cancelButton.addEventListener('click', hidePopup);





const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://new-mini-telegram-bot.onrender.com/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    });
async function connectToWallet() {
    try {
        const connectedWallet = await tonConnectUI.connectWallet();
        console.log('Wallet connected:', connectedWallet.address);
    } catch (error) {
        console.log('Connection failed:', error);
    }
}

// Add connection state listener
let showInputField = document.querySelector('.show-TransactionInput');
showInputField.style.display = "none";
let SendTransction = document.querySelector('.SendTransction');
SendTransction.style.display = "none";
let Address;




  const showUi=()=>{
    console.log("heelo from Showui");
      
      SendTransction.style.display = "block";
    

  }


let WalletConnected = document.getElementsByClassName('isconnected')[0];  // Ensure you're accessing the first (and only) element with this class
let message;

tonConnectUI.onStatusChange(walletInfo => {
  if (walletInfo) {
    // If wallet is connected, update the message text and show the input field
    if (!WalletConnected.hasChildNodes()) {
      message = document.createTextNode("Connected Wallet:");
      WalletConnected.appendChild(message);
    } else {
      WalletConnected.firstChild.nodeValue = "Connected Wallet:"; // Change the text directly
    }

    // Show the transaction input field
    showInputField.style.display = "block";
    
  } else {
    // If wallet is disconnected, clear the message and hide the input field
    WalletConnected.textContent = ""; // Clear existing content
    
    // Hide the transaction input field
    showInputField.style.display = 'none';
  }
});


const Hide=()=>{
  SendTransction.style.display = "none";
}
//transction

// Send Transaction with User Input (in TONs, or convert to nanotons if required)
async function sendTransaction() {
  try {
    const walletInfo = tonConnectUI.wallet;
    if (!walletInfo) {
      alert("No wallet connected. Please connect your wallet first.");
      return;
    }

    // Prepare the transaction object
    const transaction = {
      messages: [
        {
          address: Address,
          amount: 0.2 // Use amount in TONs directly, or `amountInNanotons` if needed
        }
      ]
    };

    // Send the transaction
    await tonConnectUI.sendTransaction(transaction);
    alert("Transaction sent successfully!");
    toggleWalletModal(false); // Close the modal after successful transaction
  } catch (error) {
    alert(`Transaction failed: ${error.message}`);
  }
}
