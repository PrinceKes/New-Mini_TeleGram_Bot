document.addEventListener("DOMContentLoaded", function () {
    const apiEndpoint = "https://sunday-mini-telegram-bot.onrender.com/api/users";
  
    // Function to fetch all users from the API
    function fetchUsers() {
      return fetch(apiEndpoint)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          alert("Unable to fetch user data. Please try again later.");
        });
    }
  
    // Function to update user info in the leaderboard
    function updateUserInfo(users) {
      const userIdElement = document.getElementById("userId");
      const myUsernameElement = document.getElementById("myusername");
      const myBalanceElement = document.getElementById("mybalance");
      const allBalanceElement = document.querySelector(".all-user-rank");
  
      // Get the currently displayed user ID from the header
      const displayedUserId = userIdElement?.innerText.replace("My ID: ", "").trim();
  
      if (!displayedUserId) {
        console.error("User ID not found in the page.");
        return;
      }
  
      // Find the exact user from the fetched data
      const currentUser = users.find((user) => user.user_id === displayedUserId);
  
      if (currentUser) {
        // Update the username and balance fields
        myUsernameElement.innerText = currentUser.username || "Unknown";
        myBalanceElement.innerText = `${currentUser.balance || 0} Rst`;
      } else {
        console.warn("User not found in the fetched data.");
        myUsernameElement.innerText = "Unknown";
        myBalanceElement.innerText = "0 Rst";
      }
  
      // Calculate the total balance of all users and update the rank element
      const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
      allBalanceElement.innerText = `#${totalBalance.toLocaleString()}`;
    }
  
    // Main execution
    fetchUsers().then((users) => {
      if (users && Array.isArray(users)) {
        updateUserInfo(users);
      }
    });
  });




  document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://sunday-mini-telegram-bot.onrender.com/api/users";
  
    try {
      // Fetch the data from the API
      const response = await fetch(apiUrl);
      const users = await response.json();
  
      // Sort users by balance in descending order
      const sortedUsers = users.sort((a, b) => b.balance - a.balance);
  
      // Populate the rank-users section with top earners
      const rankUsersContainer = document.querySelector(".rank-users");
  
      rankUsersContainer.innerHTML = ""; // Clear existing content
  
      // Map medals for the top 3 ranks
      const medals = ["🥇", "🥈", "🥉"];
  
      sortedUsers.forEach((user, index) => {
        const username = user.username || `User ${user.user_id}`;
        const balance = user.balance.toLocaleString(); // Format balance with commas
        const rank = index + 1;
  
        // Create a new leaderboard card
        const leaderboardCard = document.createElement("div");
        leaderboardCard.className = `leaderboard-card rank-${rank}`;
        leaderboardCard.innerHTML = `
          <div class="user-info">
            <img src="./assets/roaster.png" alt="User Icon">
            <div class="user-details">
              <span class="username">${username}</span>
              <span class="balance">${balance} Rst</span>
            </div>
          </div>
          <div class="user-rank ${
            medals[index] ? "medal" : ""
          }">${medals[index] || `#${rank}`}</div>
        `;
  
        // Append the card to the rank-users container
        rankUsersContainer.appendChild(leaderboardCard);
      });
    } catch (error) {
      console.error("Error fetching or processing user data:", error);
    }
  });
 