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
          taskListContainer.innerHTML = ""; // Clear the task list
          tasks.forEach((task) => {
            if (!task.isCompleted) {
              const taskBox = createTaskBox(task);
              taskListContainer.appendChild(taskBox);
            }
          });
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  
    // Create a task box element
    function createTaskBox(task) {
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
      taskButton.innerText = "Start";
      taskButton.addEventListener("click", function () {
        handleTaskStart(task, taskBox, taskButton);
      });
  
      taskBox.appendChild(taskButton);
      return taskBox;
    }
  
    // Handle task start and completion
    function handleTaskStart(task, taskBox, taskButton) {
      // Update button to "Complete"
      taskButton.innerText = "Complete";
      taskButton.classList.add("completed-btn");
  
      // When "Complete" button is clicked
      taskButton.addEventListener("click", function () {
        markTaskAsCompleted(task._id, taskBox);
      });
    }
  
    // Mark the task as completed in the backend and remove it from the UI
    function markTaskAsCompleted(taskId, taskBox) {
      fetch(`https://sunday-mini-telegram-bot.onrender.com/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Remove task from the UI
            taskBox.remove();
            updateUserBalance(data.reward); // Update user balance with the reward
          } else {
            console.error("Failed to complete task:", data.message);
          }
        })
        .catch((error) => console.error("Error completing task:", error));
    }
  
    // Update the user's balance
    function updateUserBalance(reward) {
      fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reward }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Balance updated:", data);
        })
        .catch((error) => console.error("Error updating balance:", error));
    }
  
    // Initial fetch of tasks
    fetchTasks();
  });
  





// Update task counter
function updateTaskCounter() {
    const taskCount = document.querySelectorAll('.task-item').length;
    const counterElement = document.getElementById('generalCount');
    if (counterElement) {
      counterElement.textContent = `(${taskCount})`;
    }
  }