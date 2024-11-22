// document.addEventListener('DOMContentLoaded', async () => {
//   await handleUserRegistration();
//   fetchTasks();
// });

// // Handle user registration
// async function handleUserRegistration() {
//   let userId = localStorage.getItem('userId');

//   if (!userId) {
//     console.log('No userId in localStorage. Attempting to register...');
//     const telegramUserId = getTelegramUserId();

//     if (telegramUserId) {
//       try {
//         const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/users/register', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ user_id: telegramUserId }),
//         });

//         const result = await response.json();
//         if (response.ok) {
//           localStorage.setItem('userId', telegramUserId);
//           console.log('User registered successfully.');
//         } else {
//           console.error('Failed to register user:', result.error);
//         }
//       } catch (error) {
//         console.error('Error registering user:', error);
//       }
//     }
//   } else {
//     console.log('User ID found in localStorage:', userId);
//   }
// }

// // Retrieve Telegram User ID from URL
// function getTelegramUserId() {
//   const params = new URLSearchParams(window.location.search);
//   const userId = params.get('user_id');
//   if (!userId) {
//     console.error('Telegram userId not found in the URL.');
//     return null;
//   }
//   return userId.replace(/[^a-zA-Z0-9_-]/g, ''); // Sanitize input
// }

// // Fetch tasks from the server
// async function fetchTasks() {
//   try {
//     const taskList = document.getElementById('taskList');
//     if (taskList) {
//       taskList.innerHTML = '<p>Loading tasks...</p>';
//     }

//     const response = await fetch('https://sunday-mini-telegram-bot.onrender.com/api/tasks');

//     if (!response.ok) {
//       taskList.innerHTML = '<p>Failed to fetch tasks. Please try again later.</p>';
//       console.error('Failed to fetch tasks:', await response.text());
//       return;
//     }

//     const data = await response.json();
//     displayTasks(data);
//     updateTaskCounter();
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     const taskList = document.getElementById('taskList');
//     if (taskList) {
//       taskList.innerHTML = '<p>Error loading tasks. Please refresh the page.</p>';
//     }
//   }
// }

// // Display tasks in the DOM
// function displayTasks(tasks) {
//   const taskList = document.getElementById('taskList');
//   if (!taskList) {
//     console.error('Task list container not found in the DOM.');
//     return;
//   }

//   taskList.innerHTML = '';

//   if (tasks.length === 0) {
//     taskList.innerHTML = '<p>No tasks available. Please check back later!</p>';
//     return;
//   }

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

// // Update task counter
// function updateTaskCounter() {
//   const taskCount = document.querySelectorAll('.task-item').length;
//   const counterElement = document.getElementById('generalCount');
//   if (counterElement) {
//     counterElement.textContent = `(${taskCount})`;
//   }
// }


