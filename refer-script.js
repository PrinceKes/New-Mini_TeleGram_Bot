// This script will be used in the Telegram Mini App frontend

// Function to extract the referrer ID from the Telegram link
function getReferrerId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('start');  // Extract the referrer ID from the query string
}

// Function to send the referral data to the backend
async function sendReferralData(referrerId, userId, username) {
  const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/referrals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      referrer_id: referrerId,
      user_id: userId,
      username: username,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Referral data saved:', data);
  } else {
    console.error('Error saving referral data:', data.message);
  }
}




// Function to copy the referral link to the clipboard
function copyReferralLink() {
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }

  const referralLink = `https://t.me/Roasterboldbot?start=${userId}`;
  
  const tempInput = document.createElement('input');
  tempInput.value = referralLink;
  document.body.appendChild(tempInput);
  
  tempInput.select();
  document.execCommand('copy');
  
  document.body.removeChild(tempInput);

  showNotification('Referral link copied to clipboard!');
}


document.addEventListener('DOMContentLoaded', () => {
  const referrerId = getReferrerId();
  const userId = localStorage.getItem('userId'); 
  const username = localStorage.getItem('username');
  
  if (referrerId && userId && username) {
    sendReferralData(referrerId, userId, username);
  }

  const referralButton = document.getElementById('referralButton'); 
  if (referralButton) {
    referralButton.addEventListener('click', copyReferralLink);
  }
});





























// Track claimed rewards
const claimedRewards = new Set(); // Use a Set to store IDs of claimed rewards

// Function to open the claim modal
function openClaimModal(referralId, reward) {
  const modal = document.getElementById('claim-modal');
  const claimButton = document.getElementById('claim-reward-button');
  const closeButton = document.getElementById('close-modal-button');

  // Check if the reward has already been claimed
  if (claimedRewards.has(referralId)) {
    openAlreadyClaimedModal(); // Show the "Already Claimed" modal
    return;
  }

  // Show the claim modal
  modal.style.display = 'flex';

  // Store the current "Claim" button that was clicked
  const currentClaimButton = document.querySelector(`button[data-referral-id="${referralId}"]`);

  // Attach event listener to the "Claim Reward" button in the modal
  claimButton.onclick = async function () {
    // Call the claimReward function and pass the referralId, reward, and the button
    await claimReward(referralId, reward, currentClaimButton);
  };

  // Attach event listener to the "Cancel" button to close the modal
  closeButton.onclick = function () {
    closeModal();
  };
}

// Function to handle already claimed rewards
function openAlreadyClaimedModal() {
  const alreadyClaimedModal = document.getElementById('already-claimed-modal');
  alreadyClaimedModal.style.display = 'flex';

  const closeAlreadyClaimedModal = document.getElementById('close-already-claimed-modal');
  closeAlreadyClaimedModal.onclick = function () {
    alreadyClaimedModal.style.display = 'none';
  };
}

// Function to claim the reward and update the balance
async function claimReward(referralId, reward, currentClaimButton) {
  const userId = getUserIdFromURLOrStorage();

  if (!userId) {
    alert('User ID not found. Please log in again.');
    return;
  }

  try {
    // Update the user's balance in the database
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: reward }),
    });

    if (!response.ok) {
      throw new Error('Failed to update balance');
    }

    const data = await response.json();
    alert('Reward claimed successfully!');

    // Update the balance in the UI
    const balanceElement = document.getElementById('points');
    if (balanceElement) {
      balanceElement.innerText = `Balance: ${data.balance} Rst`;
    }

    // Mark the reward as claimed
    claimedRewards.add(referralId);

    // Disable the "Claim" button and change its text to "Completed"
    currentClaimButton.disabled = true;
    currentClaimButton.innerText = 'Completed';

    // Close the modal
    closeModal();
  } catch (error) {
    console.error('Error claiming reward:', error);
    alert('Failed to claim reward. Please try again later.');
  }
}

// Function to load referrals and populate the page
async function fetchReferrals(userId) {
  try {
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch referrals');
    }

    const data = await response.json();
    const referredUsers = data.referred_Users;

    const referralsBox = document.querySelector('.referrals-box');
    referralsBox.innerHTML = '';

    referredUsers.forEach((user) => {
      const userBox = document.createElement('div');
      userBox.classList.add('users-box');

      const userName = user.referredUsername ? user.referredUsername : 'Unknown User';

      userBox.innerHTML = `
        <img src="avatar1.png" alt="User Avatar" class="user-avatar" />
        <div class="user-details">
          <h4 class="user-name">${userName}</h4>
          <p class="user-reward">+${user.reward} Rst</p>
        </div>
        <button class="claim-button" data-referral-id="${user._id}" onClick="openClaimModal('${user._id}', ${user.reward})">
          Claim
        </button>
      `;

      referralsBox.appendChild(userBox);
    });
  } catch (error) {
    console.error('Error fetching or displaying referrals:', error);

    const referralsBox = document.querySelector('.referrals-box');
    referralsBox.innerHTML = `<p class="error-message">Failed to load referrals. Please try again later.</p>`;
  }
}


document.addEventListener("DOMContentLoaded", loadReferrals);





// ............



// // Function to fetch referral data from the API and populate the page
// async function fetchReferrals(userId) {
//   try {
//     const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals?userId=${userId}`);
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch referrals');
//     }

//     const data = await response.json();
//     const referredUsers = data.referred_Users;

//     const referralsBox = document.querySelector('.referrals-box');
//     referralsBox.innerHTML = '';

//     referredUsers.forEach((user) => {
//       const userBox = document.createElement('div');
//       userBox.classList.add('users-box');

//       const userName = user.referredUsername ? user.referredUsername : 'Unknown User';

//       userBox.innerHTML = `
//         <img src="./assets/avatar.png" alt="User Avatar" class="user-avatar" />
//         <div class="user-details">
//           <h4 class="user-name">${userName}</h4>
//           <p class="user-reward">+${user.reward} Rst</p>
//         </div>
//         <button class="claim-button" onClick="openClaimModal('${user._id}', ${user.reward})">Claim</button>
//       `;

//       referralsBox.appendChild(userBox);
//     });
//   } catch (error) {
//     console.error('Error fetching or displaying referrals:', error);

//     const referralsBox = document.querySelector('.referrals-box');
//     referralsBox.innerHTML = `<p class="error-message">Copy and share your link then try again.</p>`;
//   }
// }

// // Function to get the user_id from the URL or localStorage
// function getUserIdFromURLOrStorage() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const userIdFromUrl = urlParams.get('user_id');
//   const storedUserId = localStorage.getItem('user_id');

//   let user_id = userIdFromUrl || storedUserId;

//   if (user_id) {
//     localStorage.setItem('user_id', user_id);
//   }

//   return user_id;
// }














// // Function to open the claim modal
// function openClaimModal(referralId, reward) {
//   const modal = document.getElementById('claim-modal');
//   const claimButton = document.getElementById('claim-reward-button');
//   const closeButton = document.getElementById('close-modal-button');

//   modal.style.display = 'flex';

//   const currentClaimButton = document.querySelector(`button[data-referral-id="${referralId}"]`);

//   claimButton.onclick = async function () {
//     claimButton.disabled = true;

//     await claimReward(referralId, reward, currentClaimButton);

//     claimButton.disabled = false;
//   };

//   closeButton.onclick = function () {
//     closeModal();
//   };
// }







// \\\\\\\\\\\\\\\\///////////



// // Function to claim the reward and update the balance
// async function claimReward(referralId, reward, currentClaimButton) {
//   const userId = getUserIdFromURLOrStorage();

//   if (!userId) {
//     alert('User ID not found. Please log in again.');
//     return;
//   }

//   try {
//     // Update the user's balance in the database
//     const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ amount: reward }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update balance');
//     }

//     const data = await response.json();
//     alert('Reward claimed successfully!');

//     // Update the balance in the UI
//     const balanceElement = document.getElementById('points');
//     if (balanceElement) {
//       balanceElement.innerText = `Balance: ${data.balance} Rst`;
//     }

//     // Disable the "Claim" button after successful claim
//     currentClaimButton.disabled = true;
//     currentClaimButton.innerText = 'Claimed';

//     // Close the modal
//     closeModal();
//   } catch (error) {
//     console.error('Error claiming reward:', error);
//     alert('Failed to claim reward. Please try again later.');
//   }
// }






// // Function to close the modal
// function closeModal() {
//   const modal = document.getElementById('claim-modal');
//   modal.style.display = 'none';
// }

// // Function to load referrals for the current user
// async function loadReferrals() {
//   const userId = getUserIdFromURLOrStorage();

//   if (userId) {
//     await fetchReferrals(userId);
//   } else {
//     console.error('No user_id found in URL or localStorage.');
//     const referralsBox = document.querySelector('.referrals-box');
//     // referralsBox.innerHTML = `<p class="error-message">User ID is missing. Please log in again.</p>`;
//   }
// }

// // // Trigger the referral loading process
// document.addEventListener("DOMContentLoaded", loadReferrals);


























function apiCall(url, options = {}) {
  return fetch(url, options)
      .then((response) => {
          if (!response.ok) {
              return response.json().then((errorData) => {
                  showNotification(errorData.message || 'Something went wrong', 'error');
                  throw new Error(errorData.message);
              });
          }
          return response.json();
      })
      .then((data) => {
          showNotification(data.message || 'Action completed successfully', data.type || 'success');
          return data;
      })
      .catch((error) => {
          console.error('Error:', error.message);
      });
}

// Usage
apiCall('https://sunday-mini-telegram-bot.onrender.com/api/some-action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ someData: 'value' }),
});
