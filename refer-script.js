// Function to fetch the user ID from URL or localStorage
function fetchUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('user_id'); // Get user_id from the URL
  const storedUserId = localStorage.getItem('user_id'); // Get user_id from localStorage
  
  // Use user_id from URL if available; otherwise, fallback to stored user_id
  const userId = userIdFromUrl || storedUserId;

  // Store the user_id in localStorage for persistence
  if (userId) {
    localStorage.setItem('user_id', userId);
  }

  return userId; // Return the fetched user_id
}

// Function to dynamically generate the referral link
function generateReferralLink(userId) {
  if (!userId) {
    console.error("User ID is missing, unable to generate referral link.");
    return null;
  }

  // Return the referral link with the user_id
  return `https://t.me/Roasterboldbot?start=${userId}`;
}

// Function to copy referral link to clipboard
function copyReferralLinkToClipboard(referralLink) {
  if (!referralLink) {
    console.error("Referral link is missing, cannot copy to clipboard.");
    return;
  }

  // Create a temporary input element to copy the referral link
  const tempInput = document.createElement("input");
  tempInput.value = referralLink;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  // Show a notification (assuming you have a notification function)
  showNotification("Referral link copied to clipboard!");
}

// Main logic to handle referral link generation and copying
document.addEventListener("DOMContentLoaded", () => {
  // Fetch the user_id
  const userId = fetchUserId();

  // Update the referral link dynamically
  const referralLink = generateReferralLink(userId);

  // Attach event listener to the copy button
  const copyButton = document.getElementById("copy-invite-url");
  if (copyButton) {
    copyButton.addEventListener("click", () => {
      copyReferralLinkToClipboard(referralLink);
    });
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
          data-referred-id="${user.referredUserId}">
          Completed
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
      // Perform your desired action here
      const response = await fetch(`/api/referrals/${referralId}/custom-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referredUserId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to perform action.');
        return;
      }

      // Optionally, alert the user about the successful action
      // alert('Action performed successfully.');
    } catch (error) {
      console.error('Error performing action:', error);
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
