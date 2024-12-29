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
      method: "PUT", // Changed to PUT to match server-side implementation
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: task.reward }), // Use 'amount' instead of 'reward'
    });

    if (!response.ok) throw new Error("Failed to update balance");

    const result = await response.json(); // Parse the response
    console.log(result.message); // Log success message (optional)

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

    // Show success notification
    showNotification("Task completed successfully!", "success", 3000);

    // Re-fetch and sort tasks to move completed tasks to the bottom
    fetchAndDisplayTasks(userId);
  } catch (error) {
    console.error("Error verifying task:", error);
    alert("An error occurred while verifying the task.");
  }
}











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
