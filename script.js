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
  const username = urlParams.get('tg.username');

  fetch('https://sunday-mini-telegram-bot.onrender.com/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, username }), 
  })
    .then(response => response.json())
    .then(data => console.log('User saved:', data))
    .catch(error => console.error('Error saving user:', error));
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
        points = 2000;
        pointsElement.innerText = `${points} Rst`;
      
        localStorage.setItem("hasClaimedBonus", "true");
        localStorage.setItem("userBalance", points);
      
        const userId = localStorage.getItem("user_id");
        if (userId) {
          try {
            const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId, balance: points }),
            });
      
            const data = await response.json();
            console.log("Balance updated:", data);
      
            if (response.ok) {
              displayStoredBalance(); // Fetch and display the updated balance
            }
          } catch (error) {
            console.error("Error updating balance:", error);
          }
        }
      
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





// Function to fetch and display the user's rewards points
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


// CODE BY FARAZ


// Fetch and display users in the leaderboard
// Fetch and display users in the leaderboard
function fetchAndDisplayUsers() {
  fetch('https://sunday-mini-telegram-bot.onrender.com/api/users')
    .then(response => response.json())
    .then(users => {
      const leaderboardContainer = document.querySelector('.rank-users');
      leaderboardContainer.innerHTML = ''; // Clear existing leaderboard items

      // Iterate over the users and create leaderboard entries
      users.forEach((user, index) => {
        const rank = index + 1;
        const userCard = document.createElement('div');
        userCard.classList.add('leaderboard-card');
        
        const medal = (rank === 1) ? '🥇' : (rank === 2) ? '🥈' : (rank === 3) ? '🥉' : '';

        userCard.innerHTML = `
          <div class="user-info">
            <img src="./assets/roaster.png" alt="User Icon">
            <div class="user-details">
              <span class="username">${user.username}</span>
              <span class="points">${user.balance} Roast</span>
            </div>
          </div>
          <div class="user-rank">${medal || `#${rank}`}</div>
        `;

        leaderboardContainer.appendChild(userCard);
      });
    })
    .catch(error => console.error('Error fetching users:', error));
}

// Call the function to populate the leaderboard when the page loads
window.onload = fetchAndDisplayUsers;


document.addEventListener('DOMContentLoaded', fetchUserPoints);
