document.addEventListener("DOMContentLoaded", () => {
    // Modal elements
    const modal = document.createElement("div");
    modal.id = "rewardModal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "1000";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
  
    const modalContent = `
      <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; max-width: 400px;">
        <h2>🎉 Congratulations!</h2>
        <p>You have successfully sent 0.2 TON.</p>
        <p>You have been rewarded with <strong>5000 Rst Points</strong>.</p>
        <button id="claimRewardButton" style="background: green; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Claim</button>
      </div>
    `;
  
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
  
    const handleTransactionSuccess = () => {
      modal.style.display = "flex"; // Show the modal
    };
  
    const claimReward = async () => {
      try {
        const walletInfo = tonConnectUI.wallet;
        if (!walletInfo) {
          alert("No wallet connected. Cannot award points.");
          return;
        }
  
        const userId = walletInfo.address; // Use wallet address as the unique user ID
        const rewardPoints = 5000;

        const response = await fetch("https://new-mini-telegram-bot.onrender.com/api/update-points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, points: rewardPoints }),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert("You have successfully claimed your reward points!");
        } else {
          throw new Error(result.message || "Failed to award points.");
        }
      } catch (error) {
        console.error("Error claiming reward:", error);
        alert("Failed to claim your reward. Please try again later.");
      } finally {
        modal.style.display = "none";
      }
    };
  
    document.getElementById("claimRewardButton").addEventListener("click", claimReward);
  
    // Export the success handler to be used in `script.js`
    window.handleTransactionSuccess = handleTransactionSuccess;
  });
  