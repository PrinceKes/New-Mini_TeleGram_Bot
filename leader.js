// document.addEventListener("DOMContentLoaded", function () {
//     const urlParams = new URLSearchParams(window.location.search);
//     const userIdFromURL = urlParams.get("user_id"); // Get user_id from URL
  
//     const userIdElement = document.getElementById("userId");
  
//     // Ensure the user ID is displayed in the page
//     if (userIdFromURL && userIdElement) {
//       userIdElement.innerText = `My ID: ${userIdFromURL}`;
//     } else {
//       console.warn("User ID not found in the URL or userIdElement is missing.");
//     }
  
//     const apiEndpoint = "https://sunday-mini-telegram-bot.onrender.com/api/users";
  
//     // Fetch all users from the API
//     function fetchUsers() {
//       return fetch(apiEndpoint)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Failed to fetch data: ${response.status}`);
//           }
//           return response.json();
//         })
//         .catch((error) => {
//           console.error("Error fetching users:", error);
//           alert("Unable to fetch user data. Please try again later.");
//         });
//     }
  
//     // Update user info on the leaderboard
//     function updateUserInfo(users) {
//       const myUsernameElement = document.getElementById("myusername");
//       const myBalanceElement = document.getElementById("mybalance");
//       const allBalanceElement = document.querySelector(".all-user-rank");
  
//       // Ensure we have the user_id from the URL
//       if (!userIdFromURL) {
//         console.error("User ID not found in the URL.");
//         return;
//       }
  
//       // Find the user from the API response
//       const currentUser = users.find((user) => user.user_id === userIdFromURL);
  
//       if (currentUser) {
//         myUsernameElement.innerText = currentUser.username || "Unknown";
//         myBalanceElement.innerText = `${currentUser.balance || 0} Rst`;
//       } else {
//         console.warn("User not found in the API data.");
//         myUsernameElement.innerText = "Unknown";
//         myBalanceElement.innerText = "0 Rst";
//       }
  
//       // Calculate and display the total balance of all users
//       const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
//       allBalanceElement.innerText = `#${totalBalance.toLocaleString()}`;
//     }
  
//     // Main execution
//     fetchUsers().then((users) => {
//       if (users && Array.isArray(users)) {
//         updateUserInfo(users);
//       }
//     });
//   });
  



//   document.addEventListener("DOMContentLoaded", async () => {
//     const apiUrl = "https://sunday-mini-telegram-bot.onrender.com/api/users";
  
//     try {
//       // Fetch the data from the API
//       const response = await fetch(apiUrl);
//       const users = await response.json();
  
//       // Sort users by balance in descending order
//       const sortedUsers = users.sort((a, b) => b.balance - a.balance);
  
//       // Populate the rank-users section with top earners
//       const rankUsersContainer = document.querySelector(".rank-users");
  
//       rankUsersContainer.innerHTML = ""; // Clear existing content
  
//       // Map medals for the top 3 ranks
//       const medals = ["🥇", "🥈", "🥉"];
  
//       sortedUsers.forEach((user, index) => {
//         const username = user.username || `User ${user.user_id}`;
//         const balance = user.balance.toLocaleString(); // Format balance with commas
//         const rank = index + 1;
  
//         // Create a new leaderboard card
//         const leaderboardCard = document.createElement("div");
//         leaderboardCard.className = `leaderboard-card rank-${rank}`;
//         leaderboardCard.innerHTML = `
//           <div class="user-info">
//             <img src="./assets/roaster.png" alt="User Icon">
//             <div class="user-details">
//               <span class="username">${username}</span>
//               <span class="balance">${balance} Rst</span>
//             </div>
//           </div>
//           <div class="user-rank ${
//             medals[index] ? "medal" : ""
//           }">${medals[index] || `#${rank}`}</div>
//         `;
  
//         // Append the card to the rank-users container
//         rankUsersContainer.appendChild(leaderboardCard);
//       });
//     } catch (error) {
//       console.error("Error fetching or processing user data:", error);
//     }
//   });
 







  // THE CODES FROM HERE ARE TO WORK ON THE LEADERBOARD.HTML PAGE TO DISPLAY USERS ACCORDINGLY
// code by ceo
// // Function to fetch and display user details
// function fetchAndDisplayUserDetails(user_id) {
//   const apiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/users`;

//   fetch(apiUrl)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`Failed to fetch data: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((users) => {
//       // Find the specific user details based on user_id
//       const user = users.find((u) => u.user_id === parseInt(user_id)); // Ensure `user_id` matches type

//       if (user) {
//         // Update the HTML with the user's username and balance
//         document.getElementById("myusername").innerText = user.username || "Unknown";
//         document.getElementById("mypoints").innerText = `${user.balance || 0} Rst`;
//       } else {
//         console.error("User not found in the fetched data.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching and displaying user details:", error);
//       alert("Unable to fetch user data. Please try again later.");
//     });
// }








// CODE BY FARAZ

// Fetch and display users in the leaderboard
function fetchAndDisplayUsers() {
  fetch('https://sunday-mini-telegram-bot.onrender.com/api/users')
    .then(response => response.json())
    .then(users => {
      const leaderboardContainer = document.querySelector('.rank-users');
      leaderboardContainer.innerHTML = '';

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