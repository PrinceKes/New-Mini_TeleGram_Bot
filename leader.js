document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://sunday-mini-telegram-bot.onrender.com/api/users"; // API Endpoint
  const leaderboardContainer = document.querySelector(".rank-users");
  const totalUsersElement = document.querySelector(".total-users span:last-child");
  const myUsernameElement = document.getElementById("myusername");
  const myPointsElement = document.getElementById("mypoints");

  // Helper function to create leaderboard cards
  const createLeaderboardCard = (username, balance, rank) => {
    const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
    const usernameDisplay = username || "Unknown User"; // Handle null usernames

    return `
      <div class="leaderboard-card ${rank <= 3 ? 'medal' : ''}">
        <div class="user-info">
          <img src="./assets/roaster.png" alt="User Icon">
          <div class="user-details">
            <span class="username">${usernameDisplay}</span>
            <span class="points">${balance.toLocaleString()} Rst</span>
          </div>
        </div>
        <div class="user-rank">${medalEmoji}</div>
      </div>
    `;
  };

  // Fetch data using XMLHttpRequest
  const loadLeaderboard = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, true); // True indicates async request
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const users = JSON.parse(xhr.responseText); // Parse JSON response
            console.log("Fetched users data:", users);

            if (Array.isArray(users)) {
              // Clear existing leaderboard
              leaderboardContainer.innerHTML = "";

              // Sort users by balance
              const sortedUsers = users.sort((a, b) => b.balance - a.balance);

              // Update total users count
              totalUsersElement.textContent = `${users.length.toLocaleString()} users`;

              // Populate the leaderboard
              sortedUsers.forEach((user, index) => {
                const rank = index + 1;
                const cardHTML = createLeaderboardCard(user.username, user.balance, rank);
                leaderboardContainer.innerHTML += cardHTML;
              });

              // Update "My Username" and "My Points"
              const loggedInUser = sortedUsers[0]; // Replace this logic with the actual logged-in user's data
              if (loggedInUser) {
                myUsernameElement.textContent = loggedInUser.username || "Unknown User";
                myPointsElement.textContent = `${loggedInUser.balance.toLocaleString()} Rst`;
              } else {
                myUsernameElement.textContent = "Unknown User";
                myPointsElement.textContent = "0 Rst";
              }
            } else {
              throw new Error("Invalid API response format. Expected an array.");
            }
          } catch (error) {
            console.error("Error processing leaderboard data:", error);
            displayErrorMessage();
          }
        } else {
          console.error(`API request failed with status: ${xhr.status}`);
          displayErrorMessage();
        }
      }
    };
    xhr.onerror = () => {
      console.error("Error during API request.");
      displayErrorMessage();
    };
    xhr.send();
  };

  // Display error message
  const displayErrorMessage = () => {
    leaderboardContainer.innerHTML = `
      <p class="error-message">Failed to load leaderboard data. Please try again later.</p>
    `;
  };

  // Load leaderboard on page load
  loadLeaderboard();
});
                          
