document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem('user_id');
  
    if (userId) {
      // Fetch all users from the API
      const apiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/users`;
  
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(users => {
          // Find the user data for the current user_id
          const currentUser = users.find(user => user.user_id === userId);
  
          if (currentUser) {
            // Dynamically update the username and balance
            const usernameElement = document.getElementById("myusername");
            const balanceElement = document.getElementById("mypoints");
  
            if (usernameElement) {
              usernameElement.innerText = currentUser.username || "Unknown User";
            }
            if (balanceElement) {
              balanceElement.innerText = `${currentUser.balance || 0} Rst`;
            }
          } else {
            console.warn("User not found.");
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.warn("User ID not found in localStorage.");
    }
  });
  