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
    // Fetch data from the API
    const response = await fetch(apiUrl);

    // Check if the API call was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard data: ${response.statusText}`);
    }

    const users = await response.json();

    // Verify the API response structure
    if (!Array.isArray(users)) {
      throw new Error("API response is not in the expected format.");
    }

    // Sort users by balance (if not already sorted by the API)
    const sortedUsers = users.sort((a, b) => b.balance - a.balance);

    // Update leaderboard UI
    const leaderboardContainer = document.querySelector(".rank-users");
    leaderboardContainer.innerHTML = ""; // Clear existing leaderboard cards

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
    console.error("Error loading leaderboard:", error);

    // Display error message to the user
    const leaderboardContainer = document.querySelector(".rank-users");
    leaderboardContainer.innerHTML = `<p class="error-message">Failed to load leaderboard data. Please try again later.</p>`;
  }
});
