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
          const taskBox = createTaskBox(task);
          taskListContainer.appendChild(taskBox);
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
    
    // Check if the task was completed before
    if (localStorage.getItem(`task_${task._id}_completed`)) {
      taskButton.innerText = "Complete 💯";
      taskButton.disabled = true;
      taskButton.classList.add("completed-btn");
    } else {
      taskButton.innerText = "Finish";
      taskButton.addEventListener("click", function () {
        handleTaskFinish(task, taskBox, taskButton);
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

          // Update button state
          taskButton.innerText = "Complete 💯";
          taskButton.disabled = true;
          taskButton.classList.add("completed-btn");

          // Optionally update the UI to reflect new balance
          displayUpdatedBalance(data.balance);
        } else {
          console.error("Failed to update balance:", data.error);
        }
      })
      .catch((error) => console.error("Error updating balance:", error));
  }

  // Dynamically update the balance display
  function displayUpdatedBalance(balance) {
    const balanceDisplay = document.getElementById("points");
    if (balanceDisplay) {
      balanceDisplay.innerText = `Balance: ${balance} Rst`;
    }
  }

  // Initial fetch of tasks
  fetchTasks();
});










// document.addEventListener("DOMContentLoaded", function () {
//     const userId = localStorage.getItem("user_id");
//     const taskListContainer = document.getElementById("taskList");
  
//     if (!userId) {
//       console.error("User ID is not available");
//       return;
//     }
  
//     // Fetch tasks for the current user
//     function fetchTasks() {
//       fetch("https://sunday-mini-telegram-bot.onrender.com/api/tasks")
//         .then((response) => response.json())
//         .then((tasks) => {
//           taskListContainer.innerHTML = ""; // Clear the task list
//           tasks.forEach((task) => {
//             if (!task.isCompleted) {
//               const taskBox = createTaskBox(task);
//               taskListContainer.appendChild(taskBox);
//             }
//           });
//         })
//         .catch((error) => console.error("Error fetching tasks:", error));
//     }
  
//     // Create a task box element
//     function createTaskBox(task) {
//       const taskBox = document.createElement("div");
//       taskBox.className = "task-box";
  
//       const taskContent = document.createElement("div");
//       taskContent.className = "task-content";
//       taskContent.innerHTML = `
//         <h4>${task.title}</h4>
//         <p>+ ${task.reward} Rst</p>
//       `;
//       taskBox.appendChild(taskContent);
  
//       const taskButton = document.createElement("button");
//       taskButton.className = "task-btn";
//       taskButton.innerText = "Start";
//       taskButton.addEventListener("click", function () {
//         handleTaskStart(task, taskBox, taskButton);
//       });
  
//       taskBox.appendChild(taskButton);
//       return taskBox;
//     }
  
//     // Handle task start and completion
//     function handleTaskStart(task, taskBox, taskButton) {
//       // Update button to "Complete"
//       taskButton.innerText = "Complete";
//       taskButton.classList.add("completed-btn");
  
//       // When "Complete" button is clicked
//       taskButton.addEventListener("click", function () {
//         markTaskAsCompleted(task._id, taskBox);
//       });
//     }
  
//     // Mark the task as completed in the backend and remove it from the UI
//     function markTaskAsCompleted(taskId, taskBox) {
//       fetch(`https://sunday-mini-telegram-bot.onrender.com/api/tasks/${taskId}/complete`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_id: userId }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.success) {
//             // Remove task from the UI
//             taskBox.remove();
//             updateUserBalance(data.reward); // Update user balance with the reward
//           } else {
//             console.error("Failed to complete task:", data.message);
//           }
//         })
//         .catch((error) => console.error("Error completing task:", error));
//     }
  
//     // Update the user's balance
//     function updateUserBalance(reward) {
//       fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reward }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("Balance updated:", data);
//         })
//         .catch((error) => console.error("Error updating balance:", error));
//     }
  
//     // Initial fetch of tasks
//     fetchTasks();
//   });
  





// Update task counter
//<script>
  async function updateTaskCount() {
    try {
      // Fetch data from the API
      const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const tasks = await response.json();

      // Get the total number of tasks
      const taskCount = tasks.length;

      // Update the generalCount span with the task count
      const generalCountElement = document.getElementById('generalCount');
      generalCountElement.innerHTML = `(${taskCount})`;
    } catch (error) {
      console.error('Error fetching or processing task data:', error);
    }
  }

  // Call the function when the page loads
  window.onload = updateTaskCount;
//</script>
