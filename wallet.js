document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.querySelector('.wallet-btn');
    const walletModal = document.getElementById('wallet-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
  
    walletButton.addEventListener('click', () => {
      walletModal.classList.add('show');
    });
  
    closeModalBtn.addEventListener('click', () => {
      walletModal.classList.remove('show');
    });

    walletModal.addEventListener('click', (e) => {
      if (e.target === walletModal) {
        walletModal.classList.remove('show');
      }
    });
  });
  