document.addEventListener('DOMContentLoaded', async () => {
    const referrerId = localStorage.getItem('user_id'); // Assuming user ID is stored in localStorage
    const referredFriendsSection = document.getElementById('referred-friends');
  
    const API_BASE_URL = 'https://new-mini-telegram-bot.onrender.com/api';
  
    // Function to fetch referred friends
    async function fetchReferredFriends() {
      if (!referrerId) {
        console.error('User ID not found in localStorage.');
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/referrals/${referrerId}`);
        const data = await response.json();
  
        if (!data.referrals || data.referrals.length === 0) {
          referredFriendsSection.innerHTML = `
            <div class="icon">👥</div>
            <p class="empty-text">There is nothing else. Invite to get more rewards.</p>`;
          return;
        }
  
        // Populate referrals dynamically
        referredFriendsSection.innerHTML = ''; // Clear existing content
        data.referrals.forEach((friend) => {
          const friendBox = document.createElement('div');
          friendBox.classList.add('friend-box');
          friendBox.innerHTML = `
            <div class="friend-info">
              <span class="friend-username">${friend.referredUsername}</span>
              <span class="friend-id">ID: ${friend.referredId}</span>
              <span class="friend-points">${friend.points} points</span>
            </div>`;
          referredFriendsSection.appendChild(friendBox);
        });
      } catch (error) {
        console.error('Error fetching referred friends:', error);
      }
    }
  
    // Fetch referred friends on page load
    fetchReferredFriends();
//   });
  

















    // Update invite button's referral link dynamically
    const inviteButton = document.querySelector('.invite-btn');
    if (referrerId && inviteButton) {
        const referralLink = `https://t.me/SunEarner_bot?start=${referrerId}`;
        inviteButton.setAttribute('data-referral-link', referralLink);
    }

    // Copy referral link to clipboard
    inviteButton.addEventListener('click', () => {
        const referralLink = inviteButton.getAttribute('data-referral-link');
        if (referralLink) {
        navigator.clipboard.writeText(referralLink)
            .then(() => {
            alert('Referral link copied to clipboard!');
            })
            .catch((error) => {
            console.error('Error copying referral link:', error);
            alert('Failed to copy referral link.');
            });
        } else {
        alert('Referral link not found.');
        }
    });
});


  