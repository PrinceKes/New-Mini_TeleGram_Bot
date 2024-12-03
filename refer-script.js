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
  // Get the userId from localStorage (assuming it's already stored there)
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }

  // Generate the referral link
  const referralLink = `https://t.me/SunEarner_bot?start=${userId}`;
  
  // Create a temporary input element to copy the referral link
  const tempInput = document.createElement('input');
  tempInput.value = referralLink;
  document.body.appendChild(tempInput);
  
  // Select and copy the referral link
  tempInput.select();
  document.execCommand('copy');
  
  // Remove the temporary input element
  document.body.removeChild(tempInput);

  // Optional: Show a message to the user
  alert('Referral link copied to clipboard!');
}

// Trigger referral data sending when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const referrerId = getReferrerId();
  const userId = localStorage.getItem('userId'); // This should be dynamically fetched based on user session
  const username = localStorage.getItem('username'); // This should be dynamically fetched based on user session
  
  if (referrerId && userId && username) {
    sendReferralData(referrerId, userId, username);
  }

  // Add event listener to the referral button to copy the referral link
  const referralButton = document.getElementById('referralButton'); // Assuming button has the id 'referralButton'
  if (referralButton) {
    referralButton.addEventListener('click', copyReferralLink);
  }
});




//     // Update invite button's referral link dynamically
//     const inviteButton = document.querySelector('.invite-btn');
//     if (referrerId && inviteButton) {
//         const referralLink = `https://t.me/SunEarner_bot?start=${referrerId}`;
//         inviteButton.setAttribute('data-referral-link', referralLink);
//     }

//     // Copy referral link to clipboard
//     inviteButton.addEventListener('click', () => {
//         const referralLink = inviteButton.getAttribute('data-referral-link');
//         if (referralLink) {
//         navigator.clipboard.writeText(referralLink)
//             .then(() => {
//             alert('Referral link copied to clipboard!');
//             })
//             .catch((error) => {
//             console.error('Error copying referral link:', error);
//             alert('Failed to copy referral link.');
//             });
//         } else {
//         alert('Referral link not found.');
//         }
//     });
// });


