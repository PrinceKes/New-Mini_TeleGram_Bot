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








// Complete a task
async function completeTask(taskId) {
  try {
    const user_id = localStorage.getItem('user_id'); // Use user_id instead of userId
    if (!user_id) {
      alert('User is not registered. Please register first.');
      return;
    }

    const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/users/' + user_id + '/complete-task', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || 'Failed to complete task.');
      console.error('Error completing task:', data);
      return;
    }

    alert('Task completed successfully!');
    displayStoredBalance();
  } catch (error) {
    console.error('Error completing task:', error);
    alert('An error occurred while completing the task.');
  }
}

// Claim reward for a task
async function claimReward(taskId) {
  const user_id = localStorage.getItem('user_id'); // Use user_id instead of userId
  console.log('User ID from localStorage:', user_id);
  console.log('Task ID being sent:', taskId);

  if (!user_id) {
    alert('You must be logged in to claim rewards.');
    return;
  }

  try {
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${user_id}/complete-task`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      alert(errorData.error || 'Failed to claim reward.');
      return;
    }

    const data = await response.json();
    console.log('Response data:', data);
    alert('Reward claimed successfully!');
    localStorage.setItem('userBalance', data.balance);
    displayStoredBalance();
    fetchTasks();
  } catch (error) {
    console.error('Network error:', error);
    alert('You can not claim reward multiple times.');
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

function getTelegramUserId() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user_id'); // Correct parameter name
  if (!userId) {
    console.error('Telegram userId not found in the URL.');
  }
  return userId;
}

// Update task counter
function updateTaskCounter() {
  const taskCount = document.querySelectorAll('.task-item').length;
  const counterElement = document.getElementById('generalCount');
  if (counterElement) {
    counterElement.textContent = `(${taskCount})`;
  }
}
