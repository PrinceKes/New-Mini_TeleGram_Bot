document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the user ID and username from localStorage or URL parameters
  const userId = localStorage.getItem('user_id');
  const username = new URLSearchParams(window.location.search).get('tg.username');

  if (userId && username) {
    // Fetch the user data from the API
    const apiUrl = `https://sunday-mini-telegram-bot.onrender.com/api/users`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(users => {
        // Find the user with the matching user_id
        const currentUser = users.find(user => user.user_id === userId);

        if (currentUser) {
          // Update the username and balance on the page
          const usernameElement = document.getElementById("myusername");
          const balanceElement = document.getElementById("mypoints");

          if (usernameElement) {
            usernameElement.innerText = currentUser.username || `@${username}`;
          }
          if (balanceElement) {
            balanceElement.innerText = `${currentUser.balance || 0} Rst`;
          }
        } else {
          console.warn("User not found in the API data.");
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });

    // Send the userId and username to another API endpoint if needed
    const logUrl = `https://sunday-mini-telegram-bot.onrender.com/api/some-endpoint?userId=${userId}&username=${username}`;
    fetch(logUrl).catch(error => {
      console.error("Error logging user data:", error);
    });
  } else {
    console.warn("User ID or username not found. Ensure they are in localStorage or URL parameters.");
  }
});
