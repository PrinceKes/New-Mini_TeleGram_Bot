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
      // Create a new user box element
      const userBox = document.createElement('div');
      userBox.classList.add('users-box');

      // Safely check if referredUsername exists, otherwise use 'Unknown User'
      const username = user.referredUsername ? user.referredUsername : 'Unknown User';
      
      // Add inner HTML to the user box
      userBox.innerHTML = `
        <img src="avatar1.png" alt="User Avatar" class="user-avatar" />
        <div class="user-details">
          <h4 class="user-name">${username}</h4>
          <p class="user-reward">+${user.reward} Rst</p>
        </div>
        <button class="claim-button">Claim</button>
      `;

      // Append the user box to the referrals box
      referralsBox.appendChild(userBox);
    });
  } catch (error) {
    console.error('Error fetching or displaying referrals:', error);

    // Optionally, display an error message to the user
    const referralsBox = document.querySelector('.referrals-box');
    referralsBox.innerHTML = `<p class="error-message">Failed to load referrals. Please try again later.</p>`;
  }
}

// Call the function with the user's ID (replace '1446675700' with the dynamic userId)
const userId = '1446675700'; // Replace this with the actual userId from your logic
fetchReferrals(userId);


















// Function to handle claiming the reward
async function claimReward(event) {
  const button = event.target;
  const userId = button.dataset.referralId;
  const reward = button.dataset.reward;

  try {
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reward })
    });

    const result = await response.json();
    if (result.success) {
      // Update the button text to "Claimed"
      button.innerText = "Claimed";
      button.disabled = true; // Disable button after claiming
    } else {
      console.error('Error claiming reward:', result.message);
    }
  } catch (error) {
    console.error('Error handling claim:', error);
  }
}

// Get userId from localStorage and fetch referral data
document.addEventListener('DOMContentLoaded', function () {
  const storedUserId = localStorage.getItem('user_id');
  if (storedUserId) {
    fetchReferralData(storedUserId);
  }
});
