document.addEventListener("DOMContentLoaded", function () {
  // Detect user_id from the URL or local storage
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get("user_id");
  const storedUserId = localStorage.getItem("user_id");
  const userIdElement = document.getElementById("userId");

  let user_id = userIdFromUrl || storedUserId;

  if (user_id) {
    // Save user_id to local storage
    localStorage.setItem("user_id", user_id);

    // Set up the header with user_id and avatar
    const avatarUrl = "../assets/Avatar.png";
    updateHeader(user_id, avatarUrl);

    // Save user to the database if it's from the URL
    if (userIdFromUrl) {
      saveUserIdToDatabase(user_id);
    }

    // Fetch and display tasks for the user
    fetchAndDisplayTasks(user_id);
  } else {
    // If no user_id, display unknown in the header
    if (userIdElement) {
      userIdElement.innerText = "User ID: Unknown";
    }
  }
});

// // Function to update the header with the user ID and avatar
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

// // Function to save the user ID and username to the database via API
// function saveUserIdToDatabase(user_id) {
//   const urlParams = new URLSearchParams(window.location.search);
//   const username = urlParams.get("tg.username"); // Ensure username is fetched correctly

//   fetch("https://sunday-mini-telegram-bot.onrender.com/api/users/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id, username }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("User saved:", data);
//     })
//     .catch((error) => {
//       console.error("Error saving user:", error);
//     });
// }

// Function to fetch tasks and display them on the page
async function fetchAndDisplayTasks(userId) {
  try {
    // Fetch tasks from the API
    const response = await fetch("https://sunday-mini-telegram-bot.onrender.com/api/tasks");
    const tasks = await response.json();

    // Sort tasks so completed tasks appear at the bottom
    const completedTasks = JSON.parse(localStorage.getItem(`completedTasks_${userId}`)) || [];
    const sortedTasks = tasks.sort((a, b) => completedTasks.includes(a._id) - completedTasks.includes(b._id));

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear any existing tasks

    // Display each task
    sortedTasks.forEach((task) => {
      const isCompleted = completedTasks.includes(task._id);

      const taskBox = document.createElement("div");
      taskBox.className = `task-box ${isCompleted ? "completed" : ""}`;

      const taskContent = document.createElement("div");
      taskContent.className = "task-content";
      taskContent.innerHTML = `
        <h4>${task.title}</h4>
        <p>+ ${task.reward} Rst</p>
      `;

      const taskButton = document.createElement("button");
      taskButton.className = `task-btn ${isCompleted ? "completed-btn" : ""}`;
      taskButton.textContent = isCompleted ? "Completed" : "Start";

      if (!isCompleted) {
        taskButton.onclick = () => handleTaskStart(task, userId, taskButton);
      }

      taskBox.appendChild(taskContent);
      taskBox.appendChild(taskButton);
      taskList.appendChild(taskBox);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Function to handle task start
function handleTaskStart(task, userId, button) {
  // Open the task link in a new window
  window.open(task.link, "_blank");

  // Change the button to 'Checking...' and start countdown
  button.textContent = "Checking...";
  button.disabled = true;

  let countdown = 60;
  const interval = setInterval(() => {
    countdown -= 1;
    button.textContent = `Checking... (${countdown}s)`;

    if (countdown <= 0) {
      clearInterval(interval);

      // Change button to 'Verify'
      button.textContent = "Verify";
      button.onclick = () => handleTaskVerify(task, userId, button);
      button.disabled = false;
    }
  }, 1000);
}

// Function to handle task verification
async function handleTaskVerify(task, userId, button) {
  try {
    // Update the user's balance
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reward: task.reward }),
    });

    if (!response.ok) throw new Error("Failed to update balance");

    // Mark task as completed
    const completedTasks = JSON.parse(localStorage.getItem(`completedTasks_${userId}`)) || [];
    completedTasks.push(task._id);
    localStorage.setItem(`completedTasks_${userId}`, JSON.stringify(completedTasks));

    // Update UI to show task as completed
    const taskBox = button.closest(".task-box");
    taskBox.classList.add("completed");
    button.textContent = "Completed";
    button.className = "task-btn completed-btn";
    button.disabled = true;

    // Re-fetch and sort tasks to move completed tasks to the bottom
    fetchAndDisplayTasks(userId);
  } catch (error) {
    console.error("Error verifying task:", error);
    alert("An error occurred while verifying the task.");
  }
}










// document.addEventListener("DOMContentLoaded", function () {
//     // Get user_id from localStorage
//     const userId = localStorage.getItem("user_id");
//     const avatarUrl = localStorage.getItem("avatar_url"); // Assuming avatar URL is also stored in localStorage

//     if (!userId) {
//         console.error("User ID is not available");
//         return;
//     }

//     // Update header with user information
//     updateHeader(userId, avatarUrl);

//     // Fetch and display tasks for the user
//     fetchAndDisplayTasks(userId);
// });

// // Function to fetch tasks and display them on the page
// async function fetchAndDisplayTasks(userId) {
//     try {
//         // Fetch tasks from the API
//         const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks');
//         const tasks = await response.json();

//         // Sort tasks so completed tasks appear at the bottom
//         const completedTasks = JSON.parse(localStorage.getItem(`completedTasks_${userId}`)) || [];
//         const sortedTasks = tasks.sort((a, b) => completedTasks.includes(a._id) - completedTasks.includes(b._id));

//         const taskList = document.getElementById('taskList');
//         taskList.innerHTML = ''; // Clear any existing tasks

//         // Display each task
//         sortedTasks.forEach(task => {
//             const isCompleted = completedTasks.includes(task._id);

//             const taskBox = document.createElement('div');
//             taskBox.className = `task-box ${isCompleted ? 'completed' : ''}`;

//             const taskContent = document.createElement('div');
//             taskContent.className = 'task-content';
//             taskContent.innerHTML = `
//                 <h4>${task.title}</h4>
//                 <p>+ ${task.reward} Rst</p>
//             `;

//             const taskButton = document.createElement('button');
//             taskButton.className = `task-btn ${isCompleted ? 'completed-btn' : ''}`;
//             taskButton.textContent = isCompleted ? 'Completed' : 'Start';
//             if (!isCompleted) {
//                 taskButton.onclick = () => handleTaskStart(task, userId, taskButton);
//             }

//             taskBox.appendChild(taskContent);
//             taskBox.appendChild(taskButton);
//             taskList.appendChild(taskBox);
//         });
//     } catch (error) {
//         console.error('Error fetching tasks:', error);
//     }
// }

// // Function to handle task start
// function handleTaskStart(task, userId, button) {
//     // Open the task link in a new window
//     window.open(task.link, '_blank');

//     // Change the button to 'Checking...' and start countdown
//     button.textContent = 'Checking...';
//     button.disabled = true;

//     let countdown = 60;
//     const interval = setInterval(() => {
//         countdown -= 1;
//         button.textContent = `Checking... (${countdown}s)`;

//         if (countdown <= 0) {
//             clearInterval(interval);

//             // Change button to 'Verify'
//             button.textContent = 'Verify';
//             button.onclick = () => handleTaskVerify(task, userId, button);
//             button.disabled = false;
//         }
//     }, 1000);
// }

// // Function to handle task verification
// async function handleTaskVerify(task, userId, button) {
//     try {
//         // Update the user's balance
//         const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ reward: task.reward })
//         });

//         if (!response.ok) throw new Error('Failed to update balance');

//         // Mark task as completed
//         const completedTasks = JSON.parse(localStorage.getItem(`completedTasks_${userId}`)) || [];
//         completedTasks.push(task._id);
//         localStorage.setItem(`completedTasks_${userId}`, JSON.stringify(completedTasks));

//         // Update UI to show task as completed
//         const taskBox = button.closest('.task-box');
//         taskBox.classList.add('completed');
//         button.textContent = 'Completed';
//         button.className = 'task-btn completed-btn';
//         button.disabled = true;

//         // Re-fetch and sort tasks to move completed tasks to the bottom
//         fetchAndDisplayTasks(userId);
//     } catch (error) {
//         console.error('Error verifying task:', error);
//         alert('An error occurred while verifying the task.');
//     }
// }



  










  











  
  // // Fetch tasks for the current user
  // function fetchTasks() {
  //   fetch("https://sunday-mini-telegram-bot.onrender.com/api/tasks")
  //     .then((response) => response.json())
  //     .then((tasks) => {
  //       taskListContainer.innerHTML = "";

  //       const uncompletedTasks = tasks.filter((task) => !task.isCompleted);
  //       const completedTasks = tasks.filter((task) => task.isCompleted);

  //       uncompletedTasks.forEach((task) => {
  //         const taskBox = createTaskBox(task, false);
  //         taskListContainer.appendChild(taskBox);
  //       });

  //       completedTasks.forEach((task) => {
  //         const taskBox = createTaskBox(task, true);
  //         taskListContainer.appendChild(taskBox);
  //       });
  //     })
  //     .catch((error) => console.error("Error fetching tasks:", error));
  // }



  // function fetchTasks() {
  // fetch("https://sunday-mini-telegram-bot.onrender.com/api/tasks")
  //   .then((response) => response.json())
  //   .then((tasks) => {
  //     taskListContainer.innerHTML = "";

  //     // Sort tasks: Uncompleted tasks first, then completed tasks
  //     const sortedTasks = tasks.sort((a, b) => a.isCompleted - b.isCompleted);

  //     sortedTasks.forEach((task) => {
  //       const taskBox = createTaskBox(task, task.isCompleted);
  //       taskListContainer.appendChild(taskBox);
  //     });
  //   })
  //   .catch((error) => console.error("Error fetching tasks:", error));
  // }
  

// // New function to fetch task accordindly for users
//   function fetchTasks() {
//   fetch("https://sunday-mini-telegram-bot.onrender.com/api/tasks")
//     .then((response) => response.json())
//     .then((tasks) => {
//       taskListContainer.innerHTML = "";

//       // Separate tasks based on completion status for the current user
//       const incompleteTasks = tasks.filter(
//         (task) => !localStorage.getItem(`task_${task._id}_completed`) && !task.isCompleted
//       );
//       const completedTasks = tasks.filter(
//         (task) => localStorage.getItem(`task_${task._id}_completed`) || task.isCompleted
//       );

//       // Sort by incomplete tasks first
//       const sortedTasks = [...incompleteTasks, ...completedTasks];

//       sortedTasks.forEach((task) => {
//         const taskBox = createTaskBox(task, task.isCompleted || localStorage.getItem(`task_${task._id}_completed`));
//         taskListContainer.appendChild(taskBox);
//       });
//     })
//     .catch((error) => console.error("Error fetching tasks:", error));
// }



  






  
//   // Open link in a new window or external app
//   function openLinkInNewWindow(link) {
//     const newWindow = window.open(link, "_blank");
//     if (!newWindow) {
//       alert("Unable to open the link. Please check your browser settings.");
//     }
//   }

//   // Create a task box element
//   function createTaskBox(task, isCompleted) {
//     const taskBox = document.createElement("div");
//     taskBox.className = "task-box";

//     const taskContent = document.createElement("div");
//     taskContent.className = "task-content";
//     taskContent.innerHTML = `
//       <h4>${task.title}</h4>
//       <p>+ ${task.reward} Rst</p>
//     `;
//     taskBox.appendChild(taskContent);

//     const taskButton = document.createElement("button");
//     taskButton.className = "task-btn";

//     if (isCompleted || localStorage.getItem(`task_${task._id}_completed`)) {
//       taskButton.innerText = "Completed 💯";
//       taskButton.disabled = true;
//       taskButton.classList.add("completed-btn");
//     } else {
//       taskButton.innerText = "Start";
//       taskButton.addEventListener("click", function () {
//         startTaskWithTimer(task, taskBox, taskButton);
//       });
//     }

//     taskBox.appendChild(taskButton);
//     return taskBox;
//   }

//   // Start task with timer
//   function startTaskWithTimer(task, taskBox, taskButton) {
//     openLinkInNewWindow(task.link); // Open the link in a new window or external app

//     let timer = 60; // Set timer to 60 seconds
//     taskButton.innerText = `Loading... (${timer}s)`;
//     taskButton.disabled = true;
//     taskButton.classList.add("loading-btn");

//     const countdownInterval = setInterval(() => {
//       timer--;
//       taskButton.innerText = `Loading... (${timer}s)`;

//       if (timer <= 0) {
//         clearInterval(countdownInterval);
//         taskButton.innerText = "Finish";
//         taskButton.disabled = false;
//         taskButton.classList.remove("loading-btn");
//         taskButton.classList.add("finish-btn");

//         // Change button behavior to handle task finish
//         taskButton.onclick = () => handleTaskFinish(task, taskBox, taskButton);
//       }
//     }, 1000);

//     // Handle early click on "Loading..." button
//     taskButton.addEventListener("click", function handleEarlyClick() {
//       if (timer > 0) {
//         alert("You are yet to complete the task, go back.");
//       }
//     });
//   }

//   // Handle task finish (updating user balance)
//   function handleTaskFinish(task, taskBox, taskButton) {
//     fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: task.reward }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.message === "Balance updated") {
//           console.log("User balance updated:", data.balance);

//           // Mark task as completed in local storage
//           localStorage.setItem(`task_${task._id}_completed`, true);

//           taskButton.innerText = "Completed 💯";
//           taskButton.disabled = true;
//           taskButton.classList.remove("finish-btn");
//           taskButton.classList.add("completed-btn");

//           displayUpdatedBalance(data.balance);
//         } else {
//           console.error("Failed to update balance:", data.error);
//         }
//       })
//       .catch((error) => console.error("Error updating balance:", error));
//   }

//   // Display updated balance
//   function displayUpdatedBalance(balance) {
//     const balanceDisplay = document.getElementById("points");
//     if (balanceDisplay) {
//       balanceDisplay.innerText = `Balance: ${balance} Rst`;
//     }
//   }

//   fetchTasks();
// });











// Update task counter
  async function updateTaskCount() {
    try {
      const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const tasks = await response.json();

      const taskCount = tasks.length;

      const generalCountElement = document.getElementById('generalCount');
      generalCountElement.innerHTML = `(${taskCount})`;
    } catch (error) {
      console.error('Error fetching or processing task data:', error);
    }
  }

  window.onload = updateTaskCount;
