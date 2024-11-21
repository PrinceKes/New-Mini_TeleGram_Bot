document.addEventListener('DOMContentLoaded', () => {
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
    console.log('Tasks fetched:', data.tasks);
    displayTasks(data.tasks);
    updateTaskCounter();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}


// Display tasks in the DOM
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
  startButton.onclick = () => claimReward(taskId, reward);
}


async function claimReward(taskId, reward) {
  const userId = localStorage.getItem('userId'); // Retrieve logged-in user ID
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      alert(`Failed to claim reward: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    alert('Reward claimed!');
    localStorage.setItem('userBalance', data.newBalance);
    displayStoredBalance();
    fetchTasks();
  } catch (error) {
    console.error('Error claiming reward:', error);
  }
}




async function claimReward(taskId, reward) {
  const userId = localStorage.getItem('userId'); // Retrieve logged-in user ID
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
      displayStoredBalance();
      fetchTasks();
    } else {
      alert(data.error || 'Failed to claim reward');
    }
  } catch (error) {
    console.error('Error claiming reward:', error);
  }
}







document.addEventListener('DOMContentLoaded', async () => {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    console.log('No userId in localStorage. Attempting to register...');
  } else {
    console.log('User ID found in localStorage:', userId);
  }

  // Check if userId exists in localStorage
  if (!userId) {
    const telegramUserId = getTelegramUserId(); // Retrieve Telegram user ID from query or bot
    if (telegramUserId) {
      try {
        const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: telegramUserId }),
        });

        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('userId', telegramUserId); // Store the userId locally
        } else {
          console.error('Failed to register user:', result.error);
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }

  fetchTasks();
  displayStoredBalance();
});

// Example helper function to get Telegram User ID from the query string
function getTelegramUserId() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  if (!userId) {
    console.error('Telegram userId not found in the URL');
  }
  return userId;
}











// Update user balance
function updateUserBalance(reward) {
  const currentBalance = parseInt(localStorage.getItem('userBalance')) || 0;
  const newBalance = currentBalance + reward;
  localStorage.setItem('userBalance', newBalance);
  displayStoredBalance();
}

// Display balance from localStorage
function displayStoredBalance() {
  const balanceElement = document.getElementById('points');
  const storedBalance = parseInt(localStorage.getItem('userBalance')) || 0;
  console.log('User balance:', storedBalance);
  if (balanceElement) balanceElement.textContent = `${storedBalance} Roast`;
}


// Update task counter
function updateTaskCounter() {
  const taskCount = document.querySelectorAll('.task-item').length;
  const counterElement = document.getElementById('generalCount');
  counterElement.textContent = `(${taskCount})`;
}






// document.addEventListener('DOMContentLoaded', () => {
//   fetchTasks();
// });

// // Function to fetch tasks from the server
// function fetchTasks() {
//   // fetch('http://localhost:5000/api/tasks')
//   fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks')
//     .then(response => response.json())
//     .then(data => {
//       const tasks = data.tasks;
//       displayTasks(tasks);
//       updateTaskCounter();
//     })
//     .catch(error => {
//       console.error('Error fetching tasks:', error);
//     });
// }



// // Function to display tasks in the DOM
// function displayTasks(tasks) {
//   const taskList = document.getElementById('taskList');
//   taskList.innerHTML = ''; 

//   tasks.forEach(task => {
//     const taskElement = document.createElement('div');
//     taskElement.classList.add('task-item');

//     taskElement.innerHTML = `
//       <h3>${task.title}</h3>
//       <p>${task.description}</p>
//       <p>Reward: ${task.reward} points</p>
//       <button id="startButton-${task._id}" onclick="startTask('${task._id}', '${task.link}', ${task.reward})">Start</button>
//     `;
//     taskList.appendChild(taskElement);
//   });
// }

// function startTask(taskId, link, reward) {

//   window.open(link, '_blank');

//   const startButton = document.getElementById(`startButton-${taskId}`);
//   startButton.textContent = 'Claim Reward';
//   startButton.onclick = function() {
//     claimReward(taskId, reward);
//   };
// }





// // Function to claim the reward for a task
// function claimReward(taskId, reward) {
//   // fetch(`http://localhost:5000/api/tasks/${taskId}`, {
//   fetch(`https://sunday-mini-telegram-bot.onrender.com/api/tasks/${taskId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ isCompleted: true })
//   })
//     .then(response => response.json())
//     .then(data => {
//       alert('Reward claimed!');

//       updateUserBalance(reward);

//       fetchTasks();
//     })
//     .catch(error => {
//       console.error('Error claiming reward:', error);
//     });
// }


// function updateUserBalance(reward) {

//   const currentBalance = parseInt(localStorage.getItem('userBalance')) || 0;

//   const newBalance = currentBalance + reward;

//   localStorage.setItem('userBalance', newBalance);

//   const balanceElement = document.getElementById('points');
//   if (balanceElement) {
//     balanceElement.textContent = newBalance + ' Roast';
//   } else {
//     console.error('Error: Could not find the balance element with id "points"');
//   }
// }









// // Change button text and class to "Claim Reward"
// startButton.textContent = 'Claim Reward';
// startButton.classList.add('claim-reward');

// // Function to update the task counter for the "general" tasks
// function updateTaskCounter() {
//   const tasks = document.querySelectorAll('.task-item'); 
//   const counterElement = document.getElementById('generalCount'); 
//   counterElement.textContent = `(${tasks.length})`; 
// }

// // Function to load and display balance from localStorage
// function displayStoredBalance() {
//   const balanceElement = document.getElementById('points');
//   if (balanceElement) {
//     const storedBalance = parseInt(localStorage.getItem('userBalance')) || 0;
//     balanceElement.textContent = storedBalance + ' Roast';
//   } else {
//     console.error('Error: Could not find the balance element with id "points"');
//   }
// }

// document.addEventListener('DOMContentLoaded', displayStoredBalance);
