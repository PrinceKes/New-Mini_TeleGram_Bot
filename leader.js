// // Function to fetch user data and update the leaderboard
// async function fetchAndDisplayUserDetails() {
//   try {
//     // Retrieve user_id from localStorage
//     const userId = localStorage.getItem("user_id");
//     if (!userId) {
//       console.error("User ID not found in localStorage");
//       return;
//     }

//     // Fetch user data from the API
//     const response = await fetch("https://sunday-mini-telegram-bot.onrender.com/api/user");
//     if (!response.ok) {
//       throw new Error(`Failed to fetch user data: ${response.statusText}`);
//     }

//     // Parse the JSON response
//     const users = await response.json();

//     // Find the logged-in user's details
//     const user = users.find((user) => user.user_id === userId);
//     if (!user) {
//       console.error("User not found in the database");
//       return;
//     }

//     // Update the DOM with the user's details
//     const usernameElement = document.getElementById("myusername");
//     const pointsElement = document.getElementById("mypoints");

//     usernameElement.textContent = user.username; // Display the username
//     pointsElement.textContent = `${user.balance} Roast`; // Use 'balance' for points
//   } catch (error) {
//     console.error("Error fetching and displaying user details:", error);
//   }
// }

// // Run the function after the DOM content has loaded
// document.addEventListener("DOMContentLoaded", fetchAndDisplayUserDetails);















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
 