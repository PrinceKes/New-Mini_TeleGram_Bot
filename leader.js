document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://sunday-mini-telegram-bot.onrender.com/api/users";

  // Helper function to create leaderboard cards
  function createLeaderboardCard(username, balance, rank) {
    const isMedal = rank <= 3;
    const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

    return `
      <div class="leaderboard-card ${isMedal ? 'medal' : ''}">
        <div class="user-info">
          <img src="./assets/roaster.png" alt="User Icon">
          <div class="user-details">
            <span class="username">${username}</span>
            <span class="points">${balance.toLocaleString()} Rst</span>
          </div>
        </div>
        <div class="user-rank">${medalEmoji}</div>
      </div>
    `;
  }

  try {
    console.log("Fetching data from:", apiUrl);

    // Fetch data from the API
    const response = await fetch(apiUrl);

    console.log("API response status:", response.status);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const users = await response.json();
    console.log("Fetched users:", users);

    if (!Array.isArray(users)) {
      throw new Error("Invalid API response format. Expected an array of users.");
    }

    // Sort users by balance
    const sortedUsers = users.sort((a, b) => b.balance - a.balance);

    // Update leaderboard UI
    const leaderboardContainer = document.querySelector(".rank-users");
    leaderboardContainer.innerHTML = ""; // Clear existing cards

    sortedUsers.forEach((user, index) => {
      const rank = index + 1;
      const leaderboardCard = createLeaderboardCard(user.username, user.balance, rank);
      leaderboardContainer.innerHTML += leaderboardCard;
    });

    // Update "My Username" and "My Points"
    const myUsernameElement = document.getElementById("myusername");
    const myPointsElement = document.getElementById("mypoints");

    const loggedInUser = sortedUsers.find(user => user.username === "MyUsernamePlaceholder"); // Replace with actual logic
    if (loggedInUser) {
      myUsernameElement.textContent = loggedInUser.username;
      myPointsElement.textContent = `${loggedInUser.balance.toLocaleString()} Rst`;
    } else {
      myUsernameElement.textContent = "Unknown User";
      myPointsElement.textContent = "0 Rst";
    }

    // Update total users count
    const totalUsersElement = document.querySelector(".total-users span:last-child");
    totalUsersElement.textContent = `${users.length.toLocaleString()} users`;

  } catch (error) {
    console.error("Error loading leaderboard data:", error);

    // Display error message
    const leaderboardContainer = document.querySelector(".rank-users");
    leaderboardContainer.innerHTML = `<p class="error-message">Failed to load leaderboard data. Please try again later.</p>`;
  }
});
