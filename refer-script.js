document.addEventListener("DOMContentLoaded", async () => {
    const botUsername = "SunEarner_bot";
    const inviteButton = document.querySelector(".invite-btn");
    const iconSection = document.querySelector(".icon-section");
    const referredFriendsList = document.createElement("div");

    referredFriendsList.classList.add("referred-friends");
    iconSection.replaceWith(referredFriendsList);

    let userId = null;

    // Fetch the user ID
    async function fetchUserId() {
        try {
            const response = await fetch("https://sunday-mini-telegram-bot.onrender.com/api/user");
            if (!response.ok) throw new Error("Failed to fetch user ID");
            const data = await response.json();
            userId = data.users[0]?.user_id || null; // Use the first user_id for now
            if (!userId) {
                alert("User ID not found. Please ensure you're logged in.");
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            alert("Unable to retrieve user ID.");
        }
    }
    

// Fetch the referral link
async function fetchReferralLink() {
    const userId = window.userId;
    if (!userId) {
        alert("User ID is not available. Please refresh the page.");
        return;
    }

    try {
        const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals/${userId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data.referralLink;
    } catch (error) {
        console.error("Failed to fetch referral link:", error);
        alert("Unable to generate referral link. Please try again.");
    }
    
    console.log("Using userId for referral link:", window.userId);

}

    inviteButton.addEventListener("click", async () => {
        const referralLink = await fetchReferralLink();
        if (referralLink) {
            navigator.clipboard.writeText(referralLink)
                .then(() => alert("Referral link copied to clipboard!"))
                .catch(err => console.error("Failed to copy referral link:", err));
        }
    });

    // Fetch referred friends
    async function fetchReferredFriends() {
        if (!userId) {
            console.error("User ID is not set.");
            return;
        }

        try {
            const response = await fetch(`https://sunday-mini-telegram-bot.onrender.com/api/referrals/friends/${userId}`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();

            if (data.friends && data.friends.length > 0) {
                // Populate the referred friends list
                referredFriendsList.innerHTML = data.friends.map(friend => `
                    <div class="friend-card">
                        <div class="friend-avatar">👤</div>
                        <div class="friend-info">
                            <p>${friend.referredId}</p>
                            <p>+250 RsT</p>
                        </div>
                        <button class="claim-btn">Claim</button>
                    </div>
                `).join("");
            } else {
                // Show default empty state
                referredFriendsList.innerHTML = `
                    <div class="icon-section">
                        <div class="icon">👥</div>
                        <p class="empty-text">There is nothing else. Invite to get more rewards.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Failed to fetch referred friends:", error);
        }
    }

    // Initialize
    await fetchUserId();
    fetchReferredFriends();
});
