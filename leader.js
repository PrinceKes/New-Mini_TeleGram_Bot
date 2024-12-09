document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "https://sunday-mini-telegram-bot.onrender.com/api/users";
  
  // Helper function to create leaderboard cards dynamically
  function createLeaderboardCard(username, balance, rank, isMedal = false) {
    const rankClasses = isMedal ? "leaderboard-card medal" : "leaderboard-card";
    const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

    return `
      <div class="${rankClasses}">
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
    if (!response.ok) throw new Error("Failed to fetch leaderboard data.");
    const users = await response.json();

    // Sort users by balance in descending order
    const sortedUsers = users.sort((a, b) => b.balance - a.balance);

    // Update the leaderboard dynamically
    const leaderboardContainer = document.querySelector(".rank-users");
    leaderboardContainer.innerHTML = ""; // Clear any existing leaderboard cards

    sortedUsers.forEach((user, index) => {
      const rank = index + 1;
      const isMedal = rank <= 3;
      const leaderboardCard = createLeaderboardCard(user.username, user.balance, rank, isMedal);
      leaderboardContainer.innerHTML += leaderboardCard;
    });

    // Update "My Username" and "My Points" for the logged-in user
    const myUsernameElement = document.getElementById("myusername");
    const myPointsElement = document.getElementById("mypoints");

    const myUser = sortedUsers.find(user => user.username === "MyUsernamePlaceholder"); // Replace with actual logic to fetch the logged-in user
    if (myUser) {
      myUsernameElement.textContent = myUser.username;
      myPointsElement.textContent = `${myUser.balance.toLocaleString()} Rst`;
    } else {
      myUsernameElement.textContent = "Unknown User";
      myPointsElement.textContent = "0 Rst";
    }

    // Update total users count
    const totalUsersElement = document.querySelector(".total-users span:last-child");
    totalUsersElement.textContent = `${users.length.toLocaleString()} users`;

  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
});
