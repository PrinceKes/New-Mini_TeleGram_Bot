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
document.addEventListener('DOMContentLoaded', async () => {
    // Function to extract the user_id from the URL
    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('user_id'); // Extract user_id from query params
    }

    // Function to load referral data
    async function loadReferredUsers(referralId) {
        try {
            // API endpoint to fetch referred users
            const endpoint = `https://sunday-mini-telegram-bot.onrender.com/api/referrals/${referralId}`;
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error('Failed to fetch referred users.');
            }

            const referredUsers = await response.json();

            // Populate referred users in the referrals-box
            const referralsBox = document.querySelector('.referrals-box');
            referralsBox.innerHTML = ''; // Clear any existing content

            referredUsers.forEach((user) => {
                // Create the user box dynamically
                const userBox = document.createElement('div');
                userBox.classList.add('users-box');

                userBox.innerHTML = `
                    <img src="./assets/avatar.png" alt="User Avatar" class="user-avatar" />
                    <div class="user-details">
                        <h4 class="user-name">${user.referredUsername}</h4>
                        <p class="user-reward">+${user.reward} Rst</p>
                    </div>
                    <button class="claim-button" data-referred-id="${user.referredUserId}">
                        Claim
                    </button>
                `;

                referralsBox.appendChild(userBox);
            });
        } catch (error) {
            console.error('Error loading referred users:', error);
        }
    }

    // Check if the user_id is present in the URL
    const userId = getUserIdFromUrl();

    if (userId) {
        // Store user_id in localStorage for reuse
        localStorage.setItem('referral_id', userId);

        // Load referred users using the referral_id
        loadReferredUsers(userId);
    } else {
        // Try retrieving from localStorage if not in URL
        const storedReferralId = localStorage.getItem('referral_id');
        if (storedReferralId) {
            loadReferredUsers(storedReferralId);
        } else {
            console.error('Referral ID not found in URL or localStorage.');
        }
    }
});


// Function to handle the "Claim" button click
async function handleClaimButtonClick(event) {
  const claimButton = event.target;
  const referredUserId = claimButton.dataset.referredId;
  const referralId = getReferrerId(); // Get the referral_id from the URL

  if (!referralId) {
    alert('Referral ID not found.');
    return;
  }

  try {
    // Update the user's balance
    const response = await fetch(`/api/users/${referralId}/balance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 250 }), // Add 250 to the balance
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Failed to update balance');
      return;
    }

    // Mark the referral as claimed
    const updateReferralResponse = await fetch(`/api/referrals/${referralId}/claim`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referredUserId }),
    });

    if (!updateReferralResponse.ok) {
      const error = await updateReferralResponse.json();
      alert(error.error || 'Failed to update referral status');
      return;
    }

    // On success: Update button text and disable it
    claimButton.textContent = 'Completed';
    claimButton.disabled = true;
  } catch (error) {
    console.error('Error claiming reward:', error);
    alert('An error occurred. Please try again.');
  }
}

// Attach event listeners to all "Claim" buttons
document.addEventListener('DOMContentLoaded', () => {
  const claimButtons = document.querySelectorAll('.claim-button');
  claimButtons.forEach((button) =>
    button.addEventListener('click', handleClaimButtonClick)
  );
});
