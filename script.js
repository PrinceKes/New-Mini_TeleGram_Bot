document.addEventListener("DOMContentLoaded", function() {
    // Fetch user ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    // Check if userId is found, and update the span text
    const userIdElement = document.getElementById('userId');
    if (userIdElement) {
        userIdElement.innerText = userId ? `User ID: ${userId}` : "User ID not available";
    }
});

fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar-container').innerHTML = html;
    })
    .catch(error => console.error('Error loading navbar:', error));
