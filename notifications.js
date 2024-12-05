// notifications.js

// Function to create and show notifications
function showNotification(message, type = 'success', duration = 3000) {
    // Check if a notification container exists; if not, create one
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '9999';
        container.style.width = '90%';
        container.style.maxWidth = '400px';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.style.background = type === 'success' ? '#4caf50' : '#f44336';
    notification.style.color = '#fff';
    notification.style.padding = '15px';
    notification.style.borderRadius = '5px';
    notification.style.margin = '10px 0';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.textAlign = 'center';
    notification.style.pointerEvents = 'auto';
    notification.innerText = message;

    // Append notification to the container
    container.appendChild(notification);

    // Auto-remove notification after a set duration
    setTimeout(() => {
        container.removeChild(notification);
        if (container.childNodes.length === 0) {
            document.body.removeChild(container);
        }
    }, duration);
}

// Export the function (for module systems)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = showNotification;
}
