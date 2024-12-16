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

        const uncompletedTasks = tasks.filter(task => !task.isCompleted);
        const completedTasks = tasks.filter(task => task.isCompleted);

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
      taskButton.innerText = "Complete 💯";
      taskButton.disabled = true;
      taskButton.classList.add("completed-btn");
    } else {
      taskButton.innerText = "Start";
      
      taskButton.addEventListener("click", function () {
        window.open(task.link, "_blank"); 
        taskButton.innerText = "Finish";
        taskButton.classList.add("finish-btn");

        taskButton.removeEventListener("click", arguments.callee); 
        taskButton.addEventListener("click", function () {
          handleTaskFinish(task, taskBox, taskButton);
        });
      });
    }

    taskBox.appendChild(taskButton);
    return taskBox;
  }

  // Handle task finish
  function handleTaskFinish(task, taskBox, taskButton) {
    // Update user balance
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

          taskButton.innerText = "Complete 💯";
          taskButton.disabled = true;
          taskButton.classList.add("completed-btn");

          taskListContainer.appendChild(taskBox);

          displayUpdatedBalance(data.balance);
        } else {
          console.error("Failed to update balance:", data.error);
        }
      })
      .catch((error) => console.error("Error updating balance:", error));
  }

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
