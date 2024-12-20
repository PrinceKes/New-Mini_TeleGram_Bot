document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("user_id");
  const taskListContainer = document.getElementById("taskList");

  if (!userId) {
    console.error("User ID is not available");
    return;
  }

  // Fetch tasks for the current user
  function fetchTasks() {
    fetch("https://sunday-mini-telegram-bot.onrender.com/api/tasks")
      .then((response) => response.json())
      .then((tasks) => {
        taskListContainer.innerHTML = "";

        const uncompletedTasks = tasks.filter((task) => !task.isCompleted);
        const completedTasks = tasks.filter((task) => task.isCompleted);

        uncompletedTasks.forEach((task) => {
          const taskBox = createTaskBox(task, false);
          taskListContainer.appendChild(taskBox);
        });

        completedTasks.forEach((task) => {
          const taskBox = createTaskBox(task, true);
          taskListContainer.appendChild(taskBox);
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  // Open link in a new window or external app
  function openLinkInNewWindow(link) {
    const newWindow = window.open(link, "_blank");
    if (!newWindow) {
      alert("Unable to open the link. Please check your browser settings.");
    }
  }

  // Create a task box element
  function createTaskBox(task, isCompleted) {
    const taskBox = document.createElement("div");
    taskBox.className = "task-box";

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";
    taskContent.innerHTML = `
      <h4>${task.title}</h4>
      <p>+ ${task.reward} Rst</p>
    `;
    taskBox.appendChild(taskContent);

    const taskButton = document.createElement("button");
    taskButton.className = "task-btn";

    if (isCompleted || localStorage.getItem(`task_${task._id}_completed`)) {
      taskButton.innerText = "Completed 💯";
      taskButton.disabled = true;
      taskButton.classList.add("completed-btn");
    } else {
      taskButton.innerText = "Start";
      taskButton.addEventListener("click", function () {
        startTaskWithTimer(task, taskBox, taskButton);
      });
    }

    taskBox.appendChild(taskButton);
    return taskBox;
  }

  // Start task with timer
  function startTaskWithTimer(task, taskBox, taskButton) {
    openLinkInNewWindow(task.link); // Open the link in a new window or external app

    let timer = 60; // Set timer to 60 seconds
    taskButton.innerText = `Loading... (${timer}s)`;
    taskButton.disabled = true;
    taskButton.classList.add("loading-btn");

    const countdownInterval = setInterval(() => {
      timer--;
      taskButton.innerText = `Loading... (${timer}s)`;

      if (timer <= 0) {
        clearInterval(countdownInterval);
        taskButton.innerText = "Finish";
        taskButton.disabled = false;
        taskButton.classList.remove("loading-btn");
        taskButton.classList.add("finish-btn");

        // Change button behavior to handle task finish
        taskButton.onclick = () => handleTaskFinish(task, taskBox, taskButton);
      }
    }, 1000);

    // Handle early click on "Loading..." button
    taskButton.addEventListener("click", function handleEarlyClick() {
      if (timer > 0) {
        alert("You are yet to complete the task, go back.");
      }
    });
  }

  // Handle task finish (updating user balance)
  function handleTaskFinish(task, taskBox, taskButton) {
    fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: task.reward }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Balance updated") {
          console.log("User balance updated:", data.balance);

          // Mark task as completed in local storage
          localStorage.setItem(`task_${task._id}_completed`, true);

          taskButton.innerText = "Completed 💯";
          taskButton.disabled = true;
          taskButton.classList.remove("finish-btn");
          taskButton.classList.add("completed-btn");

          displayUpdatedBalance(data.balance);
        } else {
          console.error("Failed to update balance:", data.error);
        }
      })
      .catch((error) => console.error("Error updating balance:", error));
  }

  // Display updated balance
  function displayUpdatedBalance(balance) {
    const balanceDisplay = document.getElementById("points");
    if (balanceDisplay) {
      balanceDisplay.innerText = `Balance: ${balance} Rst`;
    }
  }

  fetchTasks();
});











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
