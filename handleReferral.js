const Referral = require('./models/Referral'); // Adjust path based on your folder structure

async function handleReferral(referralId, newUserId, newUsername) {
  try {
    // Check if the referral ID exists in the database
    const referringUser = await Referral.findOne({ referral_id: referralId });

    if (!referringUser) {
      console.log(`Referral ID ${referralId} does not exist.`);
      return;
    }

    // Check if the new user has already been added to the referrals
    const isAlreadyReferred = referringUser.referrals.some(
      (referral) => referral.referredUserId === newUserId
    );

    if (isAlreadyReferred) {
      console.log(`User ${newUserId} is already referred by ${referralId}.`);
      return;
    }

    // Define the reward for the referral
    const reward = 250;

    // Add the new user to the referrals array
    referringUser.referrals.push({
      referredUserId: newUserId.toString(),
      referredUsername: newUsername,
      reward: reward,
      isClaimed: false, // Default to unclaimed
    });

    // Save the updated referral document
    await referringUser.save();
    console.log(`User ${newUserId} referred by ${referralId} successfully added.`);
  } catch (error) {
    console.error('Error handling referral:', error);
  }
}

module.exports = handleReferral;
