document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem('user_id'); // Fetch the user_id from localStorage

  if (userId) {
    // Define the API endpoint
    const apiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/users`;

    // Fetch all users from the endpoint
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then(users => {
        // Find the user data corresponding to the user_id
        const currentUser = users.find(user => user.user_id === userId);

        if (currentUser) {
          // Update the page with the current user's information
          const usernameElement = document.getElementById("myusername");
          const balanceElement = document.getElementById("mypoints");

          if (usernameElement) {
            usernameElement.innerText = currentUser.username || "Unknown User";
          }
          if (balanceElement) {
            balanceElement.innerText = `${currentUser.balance || 0} Rst`;
          }
        } else {
          console.warn("User not found in the API response.");
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  } else {
    console.warn("User ID not found in localStorage.");
  }

  // Optionally, send the user ID and username to a separate endpoint
  const username = new URLSearchParams(window.location.search).get('tg.username');
  if (userId && username) {
    const loggingApiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/some-endpoint?userId=${userId}&username=${username}`;
    fetch(loggingApiUrl)
      .catch(error => {
        console.error("Error sending user data to the logging endpoint:", error);
      });
  }
});
