    // Fetch user ID from URL query parameter

document.addEventListener("DOMContentLoaded", function() {

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    const userIdElement = document.getElementById('userId');
    if (userIdElement) {
        userIdElement.innerText = userId ? `User ID: ${userId}` : "User ID not available";
    }
});


// function that controls navbar

fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar-container').innerHTML = html;
    })
    .catch(error => console.error('Error loading navbar:', error));



    document.addEventListener("DOMContentLoaded", function() {
        // Fetch user ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
  
        // Update User ID in the header
        if (userId) {
          document.getElementById('userId').innerText = `User ID: ${userId}`;
        } else {
          document.getElementById('userId').innerText = "User ID not available";
        }
  
        // Welcome bonus logic
        const pointsElement = document.getElementById("points");
        
        // Check if user has claimed the welcome bonus before
        const hasClaimedBonus = localStorage.getItem("hasClaimedBonus");
  
        if (!hasClaimedBonus) {
          // Alert the user about the welcome bonus
          setTimeout(() => {
            alert("Welcome! Claim your 2000 PAWS as a welcome bonus!");
            
            // Update points to reflect the welcome bonus
            pointsElement.innerText = "2000 PAWS";
  
            // Store that the user has claimed the bonus to avoid repeated alerts
            localStorage.setItem("hasClaimedBonus", "true");
          }, 1000);
        } else {
          // Set points to 0 or existing points if not the first time
          pointsElement.innerText = "0 PAWS";
        }
     });