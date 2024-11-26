document.addEventListener("DOMContentLoaded", () => {
    const userId = "USER_ID_FROM_BACKEND"; // Replace with the actual user ID passed from your back-end
    const botUsername = "SunEarner_bot"; // Telegram bot username
    const inviteButton = document.querySelector(".invite-btn");
    const referredFriendsList = document.querySelector("#referred-friends-list");

    /**
     * Function to Fetch Referral Link
     */
    async function fetchReferralLink() {
        try {
            const referralLink = `https://t.me/${botUsername}?start=${userId}`;
            return referralLink;
        } catch (error) {
            console.error("Failed to fetch referral link:", error);
            alert("Unable to generate referral link. Please try again.");
        }
    }

    /**
     * Function to Copy Referral Link to Clipboard
     */
    inviteButton.addEventListener("click", async () => {
        const referralLink = await fetchReferralLink();
        if (referralLink) {
            navigator.clipboard.writeText(referralLink)
                .then(() => {
                    alert("Referral link copied to clipboard!");
                })
                .catch(err => {
                    console.error("Failed to copy referral link:", err);
                    alert("Could not copy referral link. Please try again.");
                });
        }
    });

    /**
     * Function to Fetch and Display Referred Friends
     */
    async function fetchReferredFriends() {
        try {
            // Replace with your back-end API endpoint to get referred friends
            const response = await fetch(`/get-referred-friends/${userId}`);
            const data = await response.json();

            if (data.friends && data.friends.length > 0) {
                referredFriendsList.innerHTML = data.friends.map(friend => `
                    <div class="friend">
                        <p>${friend.username} joined using your referral link!</p>
                        <button class="claim-btn" data-friend-id="${friend._id}">Claim Reward</button>
                    </div>
                `).join("");

                // Attach event listeners to "Claim Reward" buttons
                document.querySelectorAll(".claim-btn").forEach(button => {
                    button.addEventListener("click", async () => {
                        const friendId = button.getAttribute("data-friend-id");
                        await claimReward(friendId);
                    });
                });
            } else {
                referredFriendsList.innerHTML = "<p>No friends referred yet. Start inviting now!</p>";
            }
        } catch (error) {
            console.error("Failed to fetch referred friends:", error);
            alert("Unable to fetch referred friends. Please try again.");
        }
    }

    /**
     * Function to Handle Claim Reward Button
     */
    async function claimReward(friendId) {
        try {
            // Replace with your back-end API endpoint for claiming rewards
            const response = await fetch(`/claim-reward/${userId}/${friendId}`, { method: "POST" });

            if (response.ok) {
                alert("Reward successfully claimed!");
                // Optionally refresh the referred friends list
                fetchReferredFriends();
            } else {
                const errorData = await response.json();
                alert(`Failed to claim reward: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to claim reward:", error);
            alert("Could not claim reward. Please try again.");
        }
    }

    // Fetch referred friends when the page loads
    fetchReferredFriends();
});
