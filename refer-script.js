document.addEventListener('DOMContentLoaded', () => {
    const referrerId = localStorage.getItem('userId'); // Assuming the logged-in user's ID is stored in localStorage
    const referralList = document.getElementById('referral-list');
    const claimModal = document.getElementById('claim-modal');
    const claimButton = document.getElementById('claim-button');
  
    // Fetch referrals for the user
    async function fetchReferrals() {
      try {
        const response = await fetch(`/referrals/${referrerId}`);
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
      try {
        const response = await fetch('/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referrerId, referredId }),
        });
  
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
  });
  