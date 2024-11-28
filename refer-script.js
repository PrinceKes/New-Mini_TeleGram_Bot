document.addEventListener("DOMContentLoaded", () => {
    const userId = "USER_ID_FROM_BACKEND"; // Replace with actual user ID logic
    const botUsername = "SunEarner_bot";
    const inviteButton = document.querySelector(".invite-btn");
    const iconSection = document.querySelector(".icon-section");
    const referredFriendsList = document.createElement("div"); // Create a container for referred friends

    referredFriendsList.classList.add("referred-friends");
    iconSection.replaceWith(referredFriendsList); // Replace icon section dynamically

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

    fetchReferredFriends();
});




// document.addEventListener("DOMContentLoaded", () => {
//     const userId = "USER_ID_FROM_BACKEND";
//     const botUsername = "SunEarner_bot";
//     const inviteButton = document.querySelector(".invite-btn");
//     const referredFriendsList = document.querySelector("#referred-friends-list");

//     async function fetchReferralLink() {
//         try {
//             const response = await fetch(`/api/referrals/${userId}`);
//             const data = await response.json();
//             return data.referralLink;
//         } catch (error) {
//             console.error("Failed to fetch referral link:", error);
//             alert("Unable to generate referral link. Please try again.");
//         }
//     }

//     inviteButton.addEventListener("click", async () => {
//         const referralLink = await fetchReferralLink();
//         if (referralLink) {
//             navigator.clipboard.writeText(referralLink)
//                 .then(() => alert("Referral link copied to clipboard!"))
//                 .catch(err => console.error("Failed to copy referral link:", err));
//         }
//     });

//     async function fetchReferredFriends() {
//         try {
//             const response = await fetch(`/api/referrals/friends/${userId}`);
//             const data = await response.json();

//             if (data.friends && data.friends.length > 0) {
//                 referredFriendsList.innerHTML = data.friends.map(friend => `
//                     <div class="friend">
//                         <p>${friend.referredId} joined using your referral link!</p>
//                     </div>
//                 `).join("");
//             } else {
//                 referredFriendsList.innerHTML = "<p>No friends referred yet. Start inviting now!</p>";
//             }
//         } catch (error) {
//             console.error("Failed to fetch referred friends:", error);
//         }
//     }

//     fetchReferredFriends();
// });
