document.addEventListener("DOMContentLoaded", () => {
    const userId = "USER_ID_FROM_BACKEND";
    const botUsername = "SunEarner_bot";
    const inviteButton = document.querySelector(".invite-btn");
    const referredFriendsList = document.querySelector("#referred-friends-list");

    async function fetchReferralLink() {
        try {
            const response = await fetch(`/api/referrals/${userId}`);
            const data = await response.json();
            return data.referralLink;
        } catch (error) {
            console.error("Failed to fetch referral link:", error);
            alert("Unable to generate referral link. Please try again.");
        }
    }

    inviteButton.addEventListener("click", async () => {
        const referralLink = await fetchReferralLink();
        if (referralLink) {
            navigator.clipboard.writeText(referralLink)
                .then(() => alert("Referral link copied to clipboard!"))
                .catch(err => console.error("Failed to copy referral link:", err));
        }
    });

    async function fetchReferredFriends() {
        try {
            const response = await fetch(`/api/referrals/friends/${userId}`);
            const data = await response.json();

            if (data.friends && data.friends.length > 0) {
                referredFriendsList.innerHTML = data.friends.map(friend => `
                    <div class="friend">
                        <p>${friend.referredId} joined using your referral link!</p>
                    </div>
                `).join("");
            } else {
                referredFriendsList.innerHTML = "<p>No friends referred yet. Start inviting now!</p>";
            }
        } catch (error) {
            console.error("Failed to fetch referred friends:", error);
        }
    }

    fetchReferredFriends();
});
