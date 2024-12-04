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
//         <img src="avatar1.png" alt="User Avatar" class="user-avatar" />
//         <div class="user-details">
//           <h4 class="user-name">${userName}</h4>
//           <p class="user-reward">+${user.reward} Rst</p>
//         </div>
//         <button class="claim-button">Claim</button>
//       `;

//       referralsBox.appendChild(userBox);
//     });
//   } catch (error) {
//     console.error('Error fetching or displaying referrals:', error);

//     const referralsBox = document.querySelector('.referrals-box');
//     referralsBox.innerHTML = `<p class="error-message">Failed to load referrals. Please try again later.</p>`;
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

// // Function to load referrals for the current user
// async function loadReferrals() {
//   const userId = getUserIdFromURLOrStorage();

//   if (userId) {
//     await fetchReferrals(userId);
//   } else {
//     console.error('No user_id found in URL or localStorage.');
//     const referralsBox = document.querySelector('.referrals-box');
//     referralsBox.innerHTML = `<p class="error-message">User ID is missing. Please log in again.</p>`;
//   }
// }

// // Trigger the referral loading process
// document.addEventListener("DOMContentLoaded", loadReferrals);







document.addEventListener("DOMContentLoaded", function () {
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

        const claimButton = user.isClaimed
          ? '<button class="claim-button claimed" disabled>Claimed</button>'
          : '<button class="claim-button">Claim</button>';

        userBox.innerHTML = `
          <img src="avatar1.png" alt="User Avatar" class="user-avatar" />
          <div class="user-details">
            <h4 class="user-name">${userName}</h4>
            <p class="user-reward">+${user.reward} Rst</p>
          </div>
          ${claimButton}
        `;

        const button = userBox.querySelector('.claim-button');
        if (!user.isClaimed) {
          button.addEventListener('click', async () => {
            try {
              const userId = localStorage.getItem('user_id'); // Ensure the user ID is stored in local storage
          
              if (!userId) {
                alert('User ID is missing. Please log in again.');
                return;
              }
          
              const claimResponse = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals/${user._id}/claim`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }), // Include the userId in the body
              });
          
              if (!claimResponse.ok) {
                const errorData = await claimResponse.json();
                throw new Error(errorData.message || 'Failed to claim reward');
              }
          
              const result = await claimResponse.json();
              console.log(result.message);
          
              // Update the button and reward balance after a successful claim
              button.textContent = 'Claimed';
              button.disabled = true;
              button.classList.add('claimed');
            } catch (error) {
              console.error('Error claiming reward:', error);
              alert('Failed to claim reward. Please try again.');
            }
          });
                 
        }

        referralsBox.appendChild(userBox);
      });
    } catch (error) {
      console.error('Error fetching or displaying referrals:', error);
      const referralsBox = document.querySelector('.referrals-box');
      referralsBox.innerHTML = `<p class="error-message">Failed to load referrals. Please try again later.</p>`;
    }
  }

  async function loadReferrals() {
    const userId = localStorage.getItem('user_id');
    const referralId = user._id;

    if (!userId || !referralId) {
      alert('Missing user information. Please log in again.');
      return;
    }
  }

  //   if (userId) {
  //     fetchReferrals(userId);
  //   } else {
  //     console.error('User ID not found');
  //   }
  // }

  loadReferrals();
});
