// backup.js

document.addEventListener("DOMContentLoaded", function () {
  function ensureValidUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get("user_id");
    const storedUserId = localStorage.getItem("user_id");
    let user_id = userIdFromUrl || storedUserId;

    // Check if user_id is invalid or "0"
    if (!user_id || user_id === "0") {
      console.warn("Invalid or missing user_id detected. Attempting to correct...");

      const retryUserId = storedUserId && storedUserId !== "0" ? storedUserId : null;

      if (retryUserId) {
        // If a valid user_id exists in local storage, use it
        console.log("Using user_id from localStorage:", retryUserId);
        user_id = retryUserId;
      } else {
        // If no valid user_id exists, prompt the user to relaunch the app
        alert("User ID is invalid. Please relaunch the app from Telegram.");
        updateUserIdOnPage("Unknown");
        return;
      }
    }

    // Save the user_id back to local storage
    localStorage.setItem("user_id", user_id);

    // Update the header with the user_id
    const avatarUrl = "../assets/Avatar.png";
    updateHeader(user_id, avatarUrl);

    // Save user_id to the database, if it's from the URL
    if (userIdFromUrl && userIdFromUrl !== "0") {
      saveUserIdToDatabase(user_id);
    }

    // Fetch tasks and display them
    if (typeof fetchAndDisplayTasks === "function") {
      fetchAndDisplayTasks(user_id);
    }
  }

  // Retry user_id validation periodically in case the first attempt fails
  setTimeout(ensureValidUserId, 2000); // Retry after 2 seconds
});

// Function to update the user ID on the HTML page
function updateUserIdOnPage(userId) {
  const userIdElement = document.getElementById("userId");
  if (userIdElement) {
    userIdElement.innerText = `My ID: ${userId}`;
  }
}

// Function to update the header
function updateHeader(userId, avatarUrl) {
  updateUserIdOnPage(userId); // Update the user ID in the HTML

  const avatarElement = document.querySelector(".header img");
  if (avatarElement && avatarUrl) {
    avatarElement.src = avatarUrl;
  }
}

// Function to save the user ID and username to the database
function saveUserIdToDatabase(user_id) {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("tg.username"); // Ensure username is fetched correctly

  fetch("https://sunday-mini-telegram-bot.onrender.com/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, username }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User saved:", data);
    })
    .catch((error) => {
      console.error("Error saving user:", error);
    });
}








// // backup.js

// document.addEventListener("DOMContentLoaded", function () {
//   function ensureValidUserId() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const userIdFromUrl = urlParams.get("user_id");
//     const storedUserId = localStorage.getItem("user_id");
//     let user_id = userIdFromUrl || storedUserId;

//     // Check if user_id is invalid or "0"
//     if (!user_id || user_id === "0") {
//       // Attempt to reload the URL to fetch the correct user_id
//       console.warn("Invalid or missing user_id detected. Attempting to correct...");
      
//       // Retry logic to get a valid user_id
//       const retryUserId = storedUserId && storedUserId !== "0" ? storedUserId : null;

//       if (retryUserId) {
//         // If a valid user_id exists in local storage, use it
//         console.log("Using user_id from localStorage:", retryUserId);
//         user_id = retryUserId;
//       } else {
//         // If no valid user_id exists, redirect to prompt re-login via Telegram
//         alert("User ID is invalid. Please relaunch the app from Telegram.");
//         return;
//       }
//     }

//     // Save the user_id back to local storage
//     localStorage.setItem("user_id", user_id);

//     // Update the header with the user_id
//     const avatarUrl = "../assets/Avatar.png";
//     updateHeader(user_id, avatarUrl);

//     // Save user_id to the database, if it's from the URL
//     if (userIdFromUrl && userIdFromUrl !== "0") {
//       saveUserIdToDatabase(user_id);
//     }

//     // Fetch tasks and display them
//     if (typeof fetchAndDisplayTasks === "function") {
//       fetchAndDisplayTasks(user_id);
//     }
//   }

//   // Retry user_id validation periodically in case the first attempt fails
//   setTimeout(ensureValidUserId, 2000); // Retry after 2 seconds
// });

// // Function to update the header
// function updateHeader(userId, avatarUrl) {
//   const userIdElement = document.getElementById("userId");
//   const avatarElement = document.querySelector(".header img");

//   if (userIdElement) {
//     userIdElement.innerText = `User ID: ${userId}`;
//   }

//   if (avatarElement && avatarUrl) {
//     avatarElement.src = avatarUrl;
//   }
// }

// // // Function to save the user ID and username to the database
// // function saveUserIdToDatabase(user_id) {
// //   const urlParams = new URLSearchParams(window.location.search);
// //   const username = urlParams.get("tg.username"); // Ensure username is fetched correctly

// //   fetch("https://sunday-mini-telegram-bot.onrender.com/api/users/register", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ user_id, username }),
// //   })
// //     .then((response) => response.json())
// //     .then((data) => {
// //       console.log("User saved:", data);
// //     })
// //     .catch((error) => {
// //       console.error("Error saving user:", error);
// //     });
// // }
