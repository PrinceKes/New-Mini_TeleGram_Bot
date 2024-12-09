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


//function that controls alerts

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






// %%%%%&&&&&&&&&&&&&&#####@@@@!!!@#$%^&***&*()


//The function that handle displaying of referrals shauld start here
// Function to retrieve the user_id (referral_id) from URL or localStorage
function getUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('user_id');
  const storedUserId = localStorage.getItem('user_id');
  const user_id = userIdFromUrl || storedUserId;

  if (user_id) {
    localStorage.setItem('user_id', user_id); // Update localStorage for persistence
  }

  return user_id;
}

// Function to render referred users
function renderReferredUsers(referredUsers) {
  const referralsBox = document.querySelector('.referrals-box');
  referralsBox.innerHTML = ''; // Clear existing content

  referredUsers.forEach((user) => {
    const userBox = document.createElement('div');
    userBox.classList.add('users-box');

    userBox.innerHTML = `
      <img src="./assets/avatar.png" alt="User Avatar" class="user-avatar" />
      <div class="user-details">
          <h4 class="user-name">${user.referredUsername}</h4>
          <p class="user-reward">+${user.reward} RsT</p>
      </div>
      <button 
          class="claim-button" 
          data-referred-id="${user.referredUserId}" 
          ${user.isClaimed ? 'disabled' : ''}>
          ${user.isClaimed ? 'Completed' : 'Claim'}
      </button>
    `;

    referralsBox.appendChild(userBox);
  });
}

// Main script
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch user_id (referral_id)
  const referralId = getUserId();

  if (!referralId) {
    alert('User ID not found. Please ensure you access the page with a valid referral link.');
    return;
  }

  // Function to load referred users and display them
  async function loadReferredUsers() {
    try {
      const endpoint = `https://sunday-mini-telegram-bot.onrender.com/api/referrals/${referralId}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch referred users.');
      }

      const referredUsers = await response.json();
      renderReferredUsers(referredUsers); // Use the reusable function to render users
      attachClaimButtonListeners(); // Attach listeners after rendering
    } catch (error) {
      console.error('Error loading referred users:', error);
    }
  }

  // Function to handle "Claim" button click
  async function handleClaimButtonClick(event) {
    const claimButton = event.target;
    const referredUserId = claimButton.dataset.referredId;

    try {
      // Update user's balance
      const balanceResponse = await fetch(`/api/users/${referralId}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 250 }), // Reward amount
      });

      if (!balanceResponse.ok) {
        const error = await balanceResponse.json();
        alert(error.error || 'Failed to update balance');
        return;
      }

      // Mark referral as claimed
      const claimResponse = await fetch(`/api/referrals/${referralId}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referredUserId }),
      });

      if (!claimResponse.ok) {
        const error = await claimResponse.json();
        alert(error.error || 'Failed to update referral status');
        return;
      }

      // On success: Update button UI
      claimButton.textContent = 'Completed';
      claimButton.disabled = true;
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('An error occurred. Please try again.');
    }
  }

  // Attach event listeners to "Claim" buttons
  function attachClaimButtonListeners() {
    const claimButtons = document.querySelectorAll('.claim-button');
    claimButtons.forEach((button) =>
      button.addEventListener('click', handleClaimButtonClick)
    );
  }

  // Load referred users on page load
  await loadReferredUsers();
});




const userId = localStorage.getItem('user_id');
const username = new URLSearchParams(window.location.search).get('tg.username');

if (userId && username) {
  const apiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/some-endpoint?userId=${userId}&username=${username}`;
  fetch(apiUrl);
}
