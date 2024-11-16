document.addEventListener("DOMContentLoaded", async () => {
    const userId = new URLSearchParams(window.location.search).get("user_id"); // Extract user ID from query string
    const referralContainer = document.querySelector(".icon-section");
    const inviteButton = document.querySelector(".invite-btn");

    // Copy referral link to clipboard
    inviteButton.addEventListener("click", () => {
        const referralLink = `https://t.me/roasterboldg_bot/PAWS?startapp=${userId}`;
        navigator.clipboard.writeText(referralLink)
            .then(() => {
                alert("Referral link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy referral link: ", err);
            });
    });

    // Fetch referrals for the user
    try {
        const response = await fetch(`http://localhost:4000/get-referrals?user_id=${userId}`); // Change URL as needed
        if (!response.ok) throw new Error("Failed to fetch referrals");

        const referrals = await response.json();

        if (referrals.length > 0) {
            referralContainer.innerHTML = ""; // Clear placeholder content

            referrals.forEach((referral) => {
                const referralDiv = document.createElement("div");
                referralDiv.className = "referral";

                referralDiv.innerHTML = `
                    <p>${referral.referredUsername}</p>
                    <button class="claim-btn" data-id="${referral._id}">Claim Reward</button>
                `;

                referralContainer.appendChild(referralDiv);
            });

            // Add click events to claim buttons
            document.querySelectorAll(".claim-btn").forEach((button) => {
                button.addEventListener("click", async () => {
                    const referralId = button.dataset.id;

                    // Claim reward
                    try {
                        const claimResponse = await fetch("http://localhost:4000/claim-reward", { // Change URL as needed
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ referralId })
                        });

                        if (claimResponse.ok) {
                            alert("Reward claimed successfully!");
                            button.disabled = true;
                        } else {
                            alert("Failed to claim reward");
                        }
                    } catch (err) {
                        console.error("Error claiming reward:", err);
                    }
                });
            });
        } else {
            referralContainer.innerHTML = `<p>No referrals found.</p>`;
        }
    } catch (err) {
        console.error("Failed to fetch referrals:", err);
    }
});
