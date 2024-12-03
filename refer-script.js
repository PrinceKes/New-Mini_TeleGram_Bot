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





// function to control the data displaying on the html page

// Function to fetch referral data
async function fetchReferralData(userId) {
  try {
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals?userId=${userId}`);
    const referralsData = await response.json();

    // Check if we have referral data
    if (referralsData && referralsData.referred_Users && referralsData.referred_Users.length > 0) {
      const referralsBox = document.querySelector('.referrals-box');
      
      // Loop through the referred users and display them
      referralsData.referred_Users.forEach((referral) => {
        const referralElement = document.createElement('div');
        referralElement.classList.add('users-box');
        referralElement.innerHTML = `
          <img src="./assets/roaster.png" alt="User Avatar" class="user-avatar" />
          <div class="user-details">
            <h4 class="user-name">${referral.username}</h4>
            <p class="user-reward">+${referral.reward} Rst</p>
          </div>
          <button class="claim-button" data-referral-id="${referral.user_id}" data-reward="${referral.reward}">Claim</button>
        `;
        referralsBox.appendChild(referralElement);
      });

      // Attach event listeners to claim buttons
      document.querySelectorAll('.claim-button').forEach(button => {
        button.addEventListener('click', claimReward);
      });
    }
  } catch (error) {
    console.error('Error fetching referral data:', error);
  }
}

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
