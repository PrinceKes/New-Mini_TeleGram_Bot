document.addEventListener('DOMContentLoaded', async () => {
  const userId = getTelegramUserId();
  if (userId) {
    await handleUserRegistration(userId);
    fetchTasks();
    fetchUserBalance(userId); // Fetch balance from the server
  } else {
    console.error('No user ID detected. Cannot proceed.');
  }
});


// document.addEventListener('DOMContentLoaded', async () => {
//   await handleUserRegistration();
//   fetchTasks();
//   displayStoredBalance();
// });

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

    console.log('Claim Reward Response:', data);

    if (response.ok) {
      const newBalance = data.balance; // Updated to match server response
      if (newBalance !== undefined) {
        localStorage.setItem('userBalance', newBalance);
        displayStoredBalance();
        alert('Reward claimed!');
      } else {
        console.error('Balance not found in response.');
        alert('Reward claimed, but failed to update balance.');
      }
      fetchTasks(); // Refresh tasks if needed
    } else {
      console.error('Error claiming reward:', data.error);
      alert(data.error || 'Failed to claim reward.');
    }
  } catch (error) {
    console.error('Error claiming reward:', error);
    alert('An unexpected error occurred.');
  }
}


// Display stored balance
function displayStoredBalance() {
  const userBalance = localStorage.getItem('userBalance');
  const balanceElement = document.getElementById('points');
  if (balanceElement) {
    balanceElement.textContent = userBalance ? `${userBalance} Roast` : '0 Roast';
  } else {
    console.error('Balance display element (#points) not found in the DOM.');
  }
}


// Display stored balance on page load
window.onload = function () {
  displayStoredBalance();
};




// Handle user registration
async function handleUserRegistration() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
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
          userId = telegramUserId;
          localStorage.setItem('userId', telegramUserId);
          localStorage.setItem('userBalance', result.user.balance || 0);
          displayStoredBalance();
        } else {
          console.error('Failed to register user:', result.error);
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }
}


// Retrieve Telegram User ID from URL
function getTelegramUserId() {
  if (window.Telegram && window.Telegram.WebApp) {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData && initData.user && initData.user.id) {
      console.log('Telegram userId found in WebApp init data:', initData.user.id);
      return initData.user.id.toString();
    }
  }

  // Fallback to URL parameters
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user_id');
  if (userId) {
    console.log('Telegram userId found in URL:', userId);
    return userId;
  }

  console.error('Telegram userId not found in URL or WebApp context.');
  return null;
}

if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready(); // Signal that your Web App is ready
}



// every time the app is loaded, fetch the user's balance from your server:
async function fetchUserBalance(userId) {
  if (!userId) {
    console.error('No userId provided for fetching balance.');
    return;
  }

  try {
    const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/users/${userId}/balance`);
    const data = await response.json();

    if (response.ok && data.balance !== undefined) {
      localStorage.setItem('userBalance', data.balance);
      displayStoredBalance();
    } else {
      console.error('Failed to fetch balance:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error fetching user balance:', error);
  }
}

// Call this function on app load
const userId = getTelegramUserId();
if (userId) {
  fetchUserBalance(userId);
}





// Update task counter
function updateTaskCounter() {
  const taskCount = document.querySelectorAll('.task-item').length;
  const counterElement = document.getElementById('generalCount');
  if (counterElement) {
    counterElement.textContent = `(${taskCount})`;
  }
}
