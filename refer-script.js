//   Here are the updated once
document.addEventListener('DOMContentLoaded', () => {
    const referrerId = localStorage.getItem('userId'); // Assuming the logged-in user's ID is stored in localStorage
    const referralList = document.getElementById('referral-list');
    const claimModal = document.getElementById('claim-modal');
    const claimButton = document.getElementById('claim-button');
  
    // Base API URL for the mini app
    const API_BASE_URL = 'https://new-mini-telegram-bot.onrender.com/api';
  
    // Fetch referrals for the user
    async function fetchReferrals() {
      if (!referrerId) {
        console.error('User ID not found in localStorage.');
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/referrals/${referrerId}`);
        if (!response.ok) {
          console.error(`Error fetching referrals: ${response.status} ${response.statusText}`);
          return;
        }
  
        const referrals = await response.json();
        referralList.innerHTML = '';
  
        referrals.forEach((referral) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${referral.referredUsername} (ID: ${referral.referredId}) - ${referral.points} points`;
  
          const button = document.createElement('button');
          button.textContent = 'Claim Points';
          button.onclick = () => claimPoints(referral.referredId);
  
          listItem.appendChild(button);
          referralList.appendChild(listItem);
        });
  
        // Show the modal if there are referrals
        if (referrals.length > 0) {
          claimModal.style.display = 'block';
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    }
  
    // Claim points for a specific referral
    async function claimPoints(referredId) {
      if (!referrerId || !referredId) {
        console.error('Missing referrerId or referredId for claiming points.');
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/referrals/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referrerId, referredId }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error claiming points: ${response.status} ${response.statusText} - ${errorText}`);
          alert('Failed to claim points.');
          return;
        }
  
        const result = await response.json();
        alert(result.message);
  
        // Refresh referrals
        fetchReferrals();
      } catch (error) {
        console.error('Error claiming points:', error);
      }
    }
  
    // Initial fetch
    fetchReferrals();



    const copyButton = document.getElementById('copy-referral-link');
    const referralLinkInput = document.getElementById('referral-link');

    // Fetch and display the referral link
    async function fetchReferralLink() {
        const userId = localStorage.getItem('user_id'); // Ensure user ID is properly set
        if (!userId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/referrals/${userId}`);
            if (!response.ok) {
                console.error(`Error fetching referral link: ${response.status} ${response.statusText}`);
                return;
            }

            const { referralLink } = await response.json();
            referralLinkInput.value = referralLink; // Populate input with the referral link
        } catch (error) {
            console.error('Error fetching referral link:', error);
        }
    }

    // Copy functionality
    copyButton.addEventListener('click', () => {
        referralLinkInput.select();
        document.execCommand('copy');
        alert('Referral link copied to clipboard!');
    });

    // Fetch the referral link when the page loads
    fetchReferralLink();




  });
  