document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let userIdFromUrl = urlParams.get('user_id'); // Get user ID from URL
  const storedUserId = localStorage.getItem('user_id'); // Get stored user ID from localStorage
  const userIdElement = document.getElementById('userId');
  
  // Check if the user ID is available from URL or localStorage
  let userId = userIdFromUrl || storedUserId;

  // If we can't find the user ID, we attempt to detect the user via Telegram Web data
  if (!userId) {
    // Attempt to get user_id directly from Telegram's Web interface
    const telegramData = getTelegramUserData();
    if (telegramData && telegramData.user_id) {
      userId = telegramData.user_id;
      // Store it for future use
      localStorage.setItem('user_id', userId);
    }
  }

  if (userId) {
    // Update the UI with the user ID
    if (userIdElement) {
      userIdElement.innerText = `User ID: ${userId}`;
    }

    // Generate and display the referral link
    const referralLink = generateReferralLink(userId);
    if (referralLink) {
      // Update the referral link
      const referralLinkElement = document.getElementById('referralLink');
      if (referralLinkElement) {
        referralLinkElement.innerText = referralLink;
        referralLinkElement.href = referralLink;
      }

      // Attach event listener to the copy button
      const copyButton = document.getElementById("copy-invite-url");
      if (copyButton) {
        copyButton.addEventListener("click", function () {
          copyReferralLinkToClipboard(referralLink);
        });
      }
    }
  } else {
    console.error("Unable to detect user ID.");
  }
});

// Function to generate the referral link
function generateReferralLink(userId) {
  if (!userId) {
    console.error("User ID is missing, unable to generate referral link.");
    return null;
  }

  return `https://t.me/Roasterboldbot?start=${userId}`;
}

// Function to copy the referral link to clipboard
function copyReferralLinkToClipboard(referralLink) {
  if (!referralLink) {
    console.error("Referral link is missing, cannot copy to clipboard.");
    return;
  }

  // Create a temporary input element to copy the referral link
  const tempInput = document.createElement("input");
  tempInput.value = referralLink;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  // Show a notification (assuming you have a notification function)
  showNotification("Referral link copied to clipboard!");
}

// Function to detect Telegram Web user data (this function assumes Telegram Web data is available)
function getTelegramUserData() {
  // We are checking for Telegram-specific data that might be embedded in the page
  // In some cases, the Telegram Web app might provide a `Telegram.WebApp` object that includes the user_id
  if (window.Telegram && window.Telegram.WebApp) {
    const telegramUserData = window.Telegram.WebApp.user;
    if (telegramUserData && telegramUserData.id) {
      return {
        user_id: telegramUserData.id,
        username: telegramUserData.username || "Unknown"
      };
    }
  }
  return null; // Return null if no data is found
}
