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

  const referralLink = `https://t.me/SunEarner_bot?start=${userId}`;
  
  const tempInput = document.createElement('input');
  tempInput.value = referralLink;
  document.body.appendChild(tempInput);
  
  tempInput.select();
  document.execCommand('copy');
  
  document.body.removeChild(tempInput);

  alert('Referral link copied to clipboard!');
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











// Function to fetch referral data from the API and populate the page
async function fetchReferrals(userId) {
  try {
    // Make a GET request to the API
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals?userId=${userId}`);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch referrals');
    }

    // Parse the JSON response
    const data = await response.json();

    // Get the referred users array
    const referredUsers = data.referred_Users;

    // Select the referrals box element
    const referralsBox = document.querySelector('.referrals-box');

    // Clear any existing content
    referralsBox.innerHTML = '';

    // Loop through the referred users and add them dynamically
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
        <button class="claim-button">Claim</button>
      `;

      referralsBox.appendChild(userBox);
    });
  } catch (error) {
    console.error('Error fetching or displaying referrals:', error);

    const referralsBox = document.querySelector('.referrals-box');
    referralsBox.innerHTML = `<p class="error-message">Failed to load referrals. Please try again later.</p>`;
  }
}

function loadReferrals() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    console.error('No userId found in localStorage');
    const referralsBox = document.querySelector('.referrals-box');
    referralsBox.innerHTML = `<p class="error-message">User ID not found. Please log in to view referrals.</p>`;
    return;
  }

  fetchReferrals(userId);
}

loadReferrals();















// // Function to handle claiming rewards
// async function claimReward(referralId, rewardAmount, button) {
//   try {
//     // Send a POST request to the server to claim the reward
//     const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/claim-reward', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         referralId,
//         rewardAmount,
//       }),
//     });

//     const result = await response.json();

//     if (response.ok && result.success) {

//       button.textContent = 'Claimed';
//       button.disabled = true;

//       const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
//       localStorage.setItem('balance', currentBalance + rewardAmount);

//       alert('Reward claimed successfully!');
//     } else {
//       throw new Error(result.message || 'Failed to claim reward');
//     }
//   } catch (error) {
//     console.error('Error claiming reward:', error);
//     alert('Failed to claim reward. Please try again.');
//   }
// }

// // Function to fetch referral data and populate the page
// async function fetchReferrals(userId) {
//   try {
//     const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals?userId=${userId}`);
//     if (!response.ok) throw new Error('Failed to fetch referrals');
//     const data = await response.json();
//     const referredUsers = data.referred_Users;
//     const referralsBox = document.querySelector('.referrals-box');
//     referralsBox.innerHTML = '';

//     referredUsers.forEach((user) => {
//       const userBox = document.createElement('div');
//       userBox.classList.add('users-box');

//       const userName = user.referredUsername || 'Unknown User';

//       const isClaimed = user.isClaimed || false;

//       // Create inner HTML
//       userBox.innerHTML = `
//         <img src="avatar1.png" alt="User Avatar" class="user-avatar" />
//         <div class="user-details">
//           <h4 class="user-name">${userName}</h4>
//           <p class="user-reward">+${user.reward} Rst</p>
//         </div>
//         <button class="claim-button" ${isClaimed ? 'disabled' : ''}>
//           ${isClaimed ? 'Claimed' : 'Claim'}
//         </button>
//       `;

//       // Append user box
//       referralsBox.appendChild(userBox);

//       // Add event listener to the button
//       const claimButton = userBox.querySelector('.claim-button');
//       if (!isClaimed) {
//         claimButton.addEventListener('click', () => claimReward(user.referralId, user.reward, claimButton));
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching referrals:', error);
//     const referralsBox = document.querySelector('.referrals-box');
//     referralsBox.innerHTML = `<p class="error-message">Failed to load referrals. Please try again later.</p>`;
//   }
// }

// // Fetch referrals for the logged-in user
// fetchReferrals(currentUserId);
