document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('user_id'); 
  const storedUserId = localStorage.getItem('user_id');
  const userIdElement = document.getElementById('userId');

  let userId = userIdFromUrl || storedUserId;

  if (userId) {
      localStorage.setItem('user_id', userId);

      const avatarUrl = "../assets/Avatar.png";
      updateHeader(userId, avatarUrl);

      if (userIdFromUrl) {
          saveUserIdToDatabase(userId);
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

  if (avatarElement && avatarUrl) {
      avatarElement.src = avatarUrl;
  }
}

// Function to save the user ID to the database via API
function saveUserIdToDatabase(userId) {
  fetch('https://sunday-mini-telegram-bot.onrender.com/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
  })
  .then(response => response.json())
  .then(data => console.log('User ID saved:', data))
  .catch(error => console.error('Error saving user ID:', error));
}

// Navbar loading and active tab handling
// Navbar loading and active tab handling
fetch('/navbar.html') // Use an absolute path from the root
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

      claimBonusBtn.addEventListener("click", () => {
          points = 2000;
          pointsElement.innerText = `${points} Roast`;

          // Save bonus claim status locally
          localStorage.setItem("hasClaimedBonus", "true");
          localStorage.setItem("userPoints", points);

          // Update user balance in the database
          const userId = localStorage.getItem("user_id");

          if (userId) {
              fetch("https://sunday-mini-telegram-bot.onrender.com/api/users", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ user_id: userId, balance: points }),
              })
              .then(response => response.json())
              .then(data => console.log("Balance updated:", data))
              .catch(error => console.error("Error updating balance:", error));
          }

          // Hide modal
          modal.classList.add("hidden");
      });
  } else {
      points = 0;
      pointsElement.innerText = `${points} Roast`;
      localStorage.setItem("userPoints", points);
  }
} else {
  pointsElement.innerText = `${points} Roast`;
}

// Function to update user balance based on the tasks they do
document.addEventListener('DOMContentLoaded', () => {
  const balanceElement = document.getElementById('points');
  const savedBalance = localStorage.getItem('userBalance') || '0';
  balanceElement.textContent = `${savedBalance} Roast`;
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
              <td>${user.balance || 0} Roast</td>
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
