document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();
});

// Function to fetch tasks from the server
function fetchTasks() {
  // fetch('http://localhost:5000/api/tasks')
  fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks')
    .then(response => response.json())
    .then(data => {
      const tasks = data.tasks;
      displayTasks(tasks);
      updateTaskCounter();
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}



// Function to display tasks in the DOM
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; 

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');

    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Reward: ${task.reward} points</p>
      <button id="startButton-${task._id}" onclick="startTask('${task._id}', '${task.link}', ${task.reward})">Start</button>
    `;
    taskList.appendChild(taskElement);
  });
}

function startTask(taskId, link, reward) {

  window.open(link, '_blank');

  const startButton = document.getElementById(`startButton-${taskId}`);
  startButton.textContent = 'Claim Reward';
  startButton.onclick = function() {
    claimReward(taskId, reward);
  };
}





// Function to claim the reward for a task
function claimReward(taskId, reward) {
  // fetch(`http://localhost:5000/api/tasks/${taskId}`, {
  fetch(`https://sunday-mini-telegram-bot.onrender.com/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isCompleted: true })
  })
    .then(response => response.json())
    .then(data => {
      alert('Reward claimed!');

      updateUserBalance(reward);

      fetchTasks();
    })
    .catch(error => {
      console.error('Error claiming reward:', error);
    });
}


function updateUserBalance(reward) {

  const currentBalance = parseInt(localStorage.getItem('userBalance')) || 0;

  const newBalance = currentBalance + reward;

  localStorage.setItem('userBalance', newBalance);

  const balanceElement = document.getElementById('points');
  if (balanceElement) {
    balanceElement.textContent = newBalance + ' Roast';
  } else {
    console.error('Error: Could not find the balance element with id "points"');
  }
}









// Change button text and class to "Claim Reward"
startButton.textContent = 'Claim Reward';
startButton.classList.add('claim-reward');

// Function to update the task counter for the "general" tasks
function updateTaskCounter() {
  const tasks = document.querySelectorAll('.task-item'); 
  const counterElement = document.getElementById('generalCount'); 
  counterElement.textContent = `(${tasks.length})`; 
}

// Function to load and display balance from localStorage
function displayStoredBalance() {
  const balanceElement = document.getElementById('points');
  if (balanceElement) {
    const storedBalance = parseInt(localStorage.getItem('userBalance')) || 0;
    balanceElement.textContent = storedBalance + ' Roast';
  } else {
    console.error('Error: Could not find the balance element with id "points"');
  }
}

document.addEventListener('DOMContentLoaded', displayStoredBalance);
