document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('user_id');
  const storedUserId = localStorage.getItem('user_id');
  const userIdElement = document.getElementById('userId');

  let user_id = userIdFromUrl || storedUserId;

  if (user_id) {
    localStorage.setItem('user_id', user_id);

    const avatarUrl = "../assets/Avatar.png";
    updateHeader(user_id, avatarUrl);

    if (userIdFromUrl) {
      saveUserIdToDatabase(user_id);
    }
  } else {
    if (userIdElement) {
      userIdElement.innerText = "User ID: Unknown";
    }
  }
});

// Function to update the header with the user ID and avatar
function updateHeader(userId, avatarUrl) {
  const userIdElement = document.getElementById('userId');
  const avatarElement = document.querySelector(".header img");

  if (userIdElement) {
      userIdElement.innerText = `User ID: ${userId}`;
  }

  // if (avatarElement && avatarUrl) {
  //     avatarElement.src = avatarUrl;
  // }
}

// Function to save the user ID and username to the database via API
function saveUserIdToDatabase(user_id) {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('tg.username'); // Ensure username is fetched correctly

  fetch('https://sunday-mini-telegram-bot.onrender.com/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, username }) 
  })
    .then(response => response.json())
    .then(data => {
      console.log('User saved:', data);
    })
    .catch(error => {
      console.error('Error saving user:', error);
    });
}









// Navbar loading and active tab handling
fetch('/navbar.html')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(html => {
    document.getElementById('navbar-container').innerHTML = html;

    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.bottom-nav-item');

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.includes(currentPath)) {
        item.classList.add('active');
      }
    });
  })
  .catch(error => console.error('Error loading navbar:', error));





  
// Welcome bonus logic
const pointsElement = document.getElementById("points");
const modal = document.getElementById("welcome-modal");
const claimBonusBtn = document.getElementById("claim-bonus-btn");

let points = localStorage.getItem("userPoints");

if (points === null) {
  const hasClaimedBonus = localStorage.getItem("hasClaimedBonus");

  if (!hasClaimedBonus) {
    // Show modal after a delay
    setTimeout(() => {
      modal.classList.remove("hidden");
    }, 1000);

    claimBonusBtn.addEventListener("click", async () => {
  points = 2000; // Bonus amount
  pointsElement.innerText = `${points} Rst`;

  // Store bonus claim status in localStorage
  localStorage.setItem("hasClaimedBonus", "true");

  const userId = localStorage.getItem("user_id");
  if (userId) {
    try {
      // Send PUT request to update the user's balance in the database
      const response = await fetch(
        `https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 2000 }), // Send the bonus points
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Balance updated:", data);

        // Update the displayed balance with the value returned by the server
        pointsElement.innerText = `${data.balance} Rst`;
      } else {
        console.error("Failed to update balance:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  } else {
    console.error("User ID is missing! Bonus not added.");
  }

  // Hide the modal
  modal.classList.add("hidden");
});
    
  } else {
    points = 0;
    pointsElement.innerText = `${points} Rst`;
    localStorage.setItem("userPoints", points);
  }
} else {
  pointsElement.innerText = `${points} Rst`;
}



function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

showToast("Bonus Claimed Successfully!");





// Function to get Telegram user_id from localStorage or URL
function getTelegramUserId() {
  // Check if user_id is in the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get("user_id");

  // If user_id is in the URL, save it in localStorage for future use
  if (userIdFromUrl) {
    localStorage.setItem("telegram_user_id", userIdFromUrl);
    return userIdFromUrl;
  }

  // If not in the URL, check localStorage
  return localStorage.getItem("telegram_user_id");
}

// Function to fetch user balance from the server
async function fetchUserBalance(userId) {
  const endpoint = "https://sunday-mini-telegram-bot.onrender.com/api/users/balance";

  try {
    // Make the POST request to fetch user balance
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: userId })
    });

    // Parse the response
    if (response.ok) {
      const data = await response.json();
      return data.balance; // Return the balance from the response
    } else {
      console.error("Error fetching balance:", await response.text());
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return null;
  }
}

// Function to display balance in the HTML page
async function updateUserBalance() {
  const userId = getTelegramUserId();

  if (!userId) {
    console.error("User ID not found in URL or localStorage.");
    return;
  }

  // Fetch the balance
  const balance = await fetchUserBalance(userId);

  if (balance !== null) {
    // Update the balance in the HTML element
    const pointsDiv = document.getElementById("points");
    if (pointsDiv) {
      pointsDiv.textContent = `${balance} Rst`;
    } else {
      console.error("Points div not found in the HTML.");
    }
  } else {
    console.error("Could not fetch or display balance.");
  }
}

// Call the function to update the user's balance on page load
document.addEventListener("DOMContentLoaded", updateUserBalance);

// Function to update user balance based on the tasks they do
document.addEventListener('DOMContentLoaded', () => {
  const balanceElement = document.getElementById('points');
  const savedBalance = localStorage.getItem('userBalance') || '0';
  balanceElement.textContent = `${savedBalance} Rst`;
});


// Function to fetch and display users in the admin dashboard
function fetchAndDisplayUsers() {
  fetch('https://sunday-mini-telegram-bot.onrender.com/api/users')
  .then(response => response.json())
  .then(users => {
      const userTableBody = document.getElementById('user-table-body');
      userTableBody.innerHTML = ''; // Clear existing rows

      users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${user.user_id}</td>
              <td>${user.balance || 0} Rst</td>
              <td>${user.referrals ? user.referrals.length : 0}</td>
          `;
          userTableBody.appendChild(row);
      });
  })
  .catch(error => console.error('Error fetching users:', error));
}







// Function to fetch and display referrals in the admin dashboard
function fetchAndDisplayReferrals() {
  fetch('https://sunday-mini-telegram-bot.onrender.com/api/referrals')
  .then(response => response.json())
  .then(referrals => {
      const referralTableBody = document.getElementById('referral-table-body');
      referralTableBody.innerHTML = ''; // Clear existing rows

      referrals.forEach(referral => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${referral.referrer_id}</td>
              <td>${referral.referred_id}</td>
              <td>${referral.status}</td>
          `;
          referralTableBody.appendChild(row);
      });
  })
  .catch(error => console.error('Error fetching referrals:', error));
}

// Call these functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayUsers();
  fetchAndDisplayReferrals();
});

// Function to fetch and display the user's rewards points and balance
async function fetchUserPoints() {
  try {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      throw new Error('User ID is not available');
    }

    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/user-points?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user points');
    }

    const data = await response.json();
    const pointsDiv = document.getElementById('points');

    pointsDiv.textContent = `${data.points} Rst`;
  } catch (error) {
    console.error('Error fetching user points:', error);
    // alert('An error occurred while fetching points');
  }
}

document.addEventListener('DOMContentLoaded', fetchUserPoints);

// functions for alerting from server to clients
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
