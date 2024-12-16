function apiCall(url, options = {}) {
  return fetch(url, options)
      .then((response) => {
          if (!response.ok) {
              return response.json().then((errorData) => {
                  showNotification(errorData.message || 'Something went wrong', 'error');
                  throw new Error(errorData.message);
              });
          }
          return response.json();
      })
      .then((data) => {
          showNotification(data.message || 'Action completed successfully', data.type || 'success');
          return data;
      })
      .catch((error) => {
          console.error('Error:', error.message);
      });
}

// Usage
apiCall('https://sunday-mini-telegram-bot.onrender.com/api/some-action', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ someData: 'value' }),
});
