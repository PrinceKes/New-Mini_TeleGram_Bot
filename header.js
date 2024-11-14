// Function to update the user information in the header
function updateHeader(userId, avatarUrl) {
    const userIdElement = document.getElementById('userId');
    if (userIdElement) {
        userIdElement.textContent = `User ID: ${userId}`;
    }

    const avatarElement = document.querySelector('.header img');
    if (avatarElement) {
        avatarElement.src = avatarUrl;
    }
}

