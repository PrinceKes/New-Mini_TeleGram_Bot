document.addEventListener("DOMContentLoaded", async () => {
    const botUsername = "SunEarner_bot";
    const inviteButton = document.querySelector(".invite-btn");
    const referredFriendsList = document.getElementById("referred-friends");
    let userId = null;
  
    // Custom Alert
    function showCustomAlert(message, duration = 3000) {
      const alertBox = document.getElementById("custom-alert");
      const alertMessage = document.getElementById("custom-alert-message");
  
      alertMessage.textContent = message;
      alertBox.classList.remove("hidden");
      alertBox.classList.add("show");
  
      setTimeout(() => {
        alertBox.classList.remove("show");
        setTimeout(() => {
          alertBox.classList.add("hidden");
        }, 300);
      }, duration);
    }
  
    // Fetch User ID
    async function fetchUserId() {
      try {
        const response = await fetch("https://sunday-mini-telegram-bot.onrender.com/api/user");
        if (!response.ok) throw new Error("Failed to fetch user ID");
        const data = await response.json();
        userId = data.users[0]?.user_id || null;
      } catch (error) {
        console.error("Error fetching user ID:", error);
        showCustomAlert("Unable to retrieve user ID.");
      }
    }
  
    // Fetch Referral Link
    async function fetchReferralLink() {
      if (!userId) return null;
      try {
        const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch referral link");
        const data = await response.json();
        return data.referralLink;
      } catch (error) {
        console.error("Error fetching referral link:", error);
      }
    }
  
    // Fetch Referred Friends
    async function fetchReferredFriends() {
      try {
        const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals/friends/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch referred friends");
        const data = await response.json();
  
        if (data && data.length > 0) {
          referredFriendsList.innerHTML = data.map(friend => `
            <div class="friend-card">
              <div class="friend-avatar">👤</div>
              <div class="friend-info">
                <p>${friend.referredUsername}</p>
                <p>${friend.points} RsT</p>
              </div>
              <button class="claim-btn" data-referred-id="${friend.referredId}">Claim</button>
            </div>
          `).join("");
  
          document.querySelectorAll(".claim-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
              const referredId = e.target.getAttribute("data-referred-id");
              await claimPoints(referredId);
            });
          });
        } else {
          referredFriendsList.innerHTML = `
            <div class="icon-section">
              <div class="icon">👥</div>
              <p class="empty-text">There is nothing else. Invite to get more rewards.</p>
            </div>
          `;
        }
      } catch (error) {
        console.error("Error fetching referred friends:", error);
      }
    }
  
    // Claim Points
    async function claimPoints(referredId) {
      try {
        const response = await fetch("https://sunday-mini-telegram-bot.onrender.com/api/referrals/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ referredId })
        });
  
        if (response.ok) {
          showCustomAlert("Points claimed successfully!");
          fetchReferredFriends();
        } else {
          const errorData = await response.json();
          showCustomAlert(errorData.message || "Failed to claim points.");
        }
      } catch (error) {
        console.error("Error claiming points:", error);
      }
    }
  
    // Initialize
    await fetchUserId();
    fetchReferredFriends();
  
    inviteButton.addEventListener("click", async () => {
      const referralLink = await fetchReferralLink();
      if (referralLink) {
        navigator.clipboard.writeText(referralLink)
          .then(() => showCustomAlert("Referral Link copied successfully!"))
          .catch(err => console.error("Failed to copy referral link:", err));
      }
    });
  });
  











//   Here are the updated once
document.addEventListener('DOMContentLoaded', () => {
    const referrerId = localStorage.getItem('userId'); // Assuming the logged-in user's ID is stored in localStorage
    const referralList = document.getElementById('referral-list');
    const claimModal = document.getElementById('claim-modal');
    const claimButton = document.getElementById('claim-button');
  
    // Base API URL for the mini app
    const API_BASE_URL = 'https://new-mini-telegram-bot.onrender.com/api';
  
    // Fetch referrals for the user
    async function fetchReferrals() {
      if (!referrerId) {
        console.error('User ID not found in localStorage.');
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/referrals/${referrerId}`);
        if (!response.ok) {
          console.error(`Error fetching referrals: ${response.status} ${response.statusText}`);
          return;
        }
  
        const referrals = await response.json();
        referralList.innerHTML = '';
  
        referrals.forEach((referral) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${referral.referredUsername} (ID: ${referral.referredId}) - ${referral.points} points`;
  
          const button = document.createElement('button');
          button.textContent = 'Claim Points';
          button.onclick = () => claimPoints(referral.referredId);
  
          listItem.appendChild(button);
          referralList.appendChild(listItem);
        });
  
        // Show the modal if there are referrals
        if (referrals.length > 0) {
          claimModal.style.display = 'block';
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    }
  
    // Claim points for a specific referral
    async function claimPoints(referredId) {
      if (!referrerId || !referredId) {
        console.error('Missing referrerId or referredId for claiming points.');
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/referrals/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referrerId, referredId }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error claiming points: ${response.status} ${response.statusText} - ${errorText}`);
          alert('Failed to claim points.');
          return;
        }
  
        const result = await response.json();
        alert(result.message);
  
        // Refresh referrals
        fetchReferrals();
      } catch (error) {
        console.error('Error claiming points:', error);
      }
    }
  
    // Initial fetch
    fetchReferrals();
  });
  



