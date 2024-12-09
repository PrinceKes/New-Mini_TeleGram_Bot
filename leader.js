document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/users`;

  // Fetch all users from the API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(users => {
      // Sort users by balance in descending order
      const sortedUsers = users.sort((a, b) => b.balance - a.balance);

      // Select the container for the leaderboard cards
      const leaderboardContainer = document.querySelector(".rank-users");

      // Clear any existing content
      leaderboardContainer.innerHTML = "";

      // Generate and append the leaderboard cards dynamically
      sortedUsers.forEach((user, index) => {
        // Create a card for each user
        const rank = index + 1; // Calculate the rank
        const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
        const cardHtml = `
          <div class="leaderboard-card ${rank <= 3 ? `rank-${rank}` : ""}">
            <div class="user-info">
              <img src="./assets/roaster.png" alt="User Icon">
              <div class="user-details">
                <span class="username">${user.username || "Unknown User"}</span>
                <span class="points">${user.balance.toLocaleString()} Rst</span>
              </div>
            </div>
            <div class="user-rank ${rank <= 3 ? "medal" : ""}">${medal}</div>
          </div>
        `;

        // Append the card to the container
        leaderboardContainer.innerHTML += cardHtml;
      });
    })
    .catch(error => {
      console.error("Error fetching leaderboard data:", error);
    });
});
