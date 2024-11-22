document.addEventListener('DOMContentLoaded', async () => {
  await handleUserRegistration();
  fetchTasks();
  displayStoredBalance();
});

// Fetch tasks from the server
async function fetchTasks() {
  try {
    console.log('Fetching tasks...');
    const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks');
    
    if (!response.ok) {
      console.error('Failed to fetch tasks:', await response.text());
      return;
    }
    
    const data = await response.json();
    console.log('Tasks fetched:', data);

    if (Array.isArray(data)) {
      displayTasks(data);
    } else {
      console.error('Unexpected tasks response:', data);
    }

    updateTaskCounter();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// Display tasks in the DOM
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  if (!taskList) {
    console.error('Task list container not found in the DOM.');
    return;
  }

  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p>No tasks available. Please check back later!</p>';
    return;
  }

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
  startButton.onclick = () => claimReward(taskId, reward);
}

// Claim reward for a task
async function claimReward(taskId, reward) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('You must be logged in to claim rewards.');
    return;
  }

  try {
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Reward claimed!');
      localStorage.setItem('userBalance', data.newBalance);
      displayStoredBalance(); // Ensure the UI reflects the latest balance
      fetchTasks();
    } else {
      console.error('Error claiming reward:', data.error);
      alert(data.error || 'Failed to claim reward.');
    }
  } catch (error) {
    console.error('Error claiming reward:', error);
  }
}


// Handle user registration
async function handleUserRegistration() {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    console.log('No userId in localStorage. Attempting to register...');
    const telegramUserId = getTelegramUserId();

    if (telegramUserId) {
      try {
        const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: telegramUserId }),
        });

        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('userId', telegramUserId);
          console.log('User registered successfully.');
        } else {
          console.error('Failed to register user:', result.error);
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  } else {
    console.log('User ID found in localStorage:', userId);
  }
}

// Retrieve Telegram User ID from URL
function getTelegramUserId() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user_id');
  if (!userId) {
    console.error('Telegram userId not found in the URL.');
    return null;
  }
  return userId.replace(/[^a-zA-Z0-9_-]/g, ''); // Sanitize input
}

// function getTelegramUserId() {
//   const params = new URLSearchParams(window.location.search);
//   const userId = params.get('user_id'); // Correct parameter name
//   if (!userId) {
//     console.error('Telegram userId not found in the URL.');
//   }
//   return userId;
// }

// Display stored balance
function displayStoredBalance() {
  const balanceElement = document.getElementById('points');
  if (!balanceElement) {
    console.error('Balance display element not found.');
    return;
  }

  const storedBalance = parseInt(localStorage.getItem('userBalance')) || 0;
  balanceElement.textContent = `${storedBalance} Roast`;
  console.log('User balance displayed:', storedBalance);
}

// function displayStoredBalance() {
//   const balanceElement = document.getElementById('points');
//   const storedBalance = parseInt(localStorage.getItem('userBalance')) || 0;
//   console.log('User balance:', storedBalance);

//   if (balanceElement) {
//     balanceElement.textContent = `${storedBalance} Roast`;
//   }
// }

// Update task counter
function updateTaskCounter() {
  const taskCount = document.querySelectorAll('.task-item').length;
  const counterElement = document.getElementById('generalCount');
  if (counterElement) {
    counterElement.textContent = `(${taskCount})`;
  }
}
