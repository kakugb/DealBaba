const cron = require('node-cron');
const { Op } = require('sequelize');
const PendingUser = require('../models/pendingUsers.js'); // Assuming you have the PendingUser model

// Schedule a cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const cutoffTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);  // 2 days ago

    // Find users who have not verified and whose OTPs have expired
    await PendingUser.destroy({
      where: {
        isVerified: false,  // Ensure user is not verified
        createdAt: {
          [Op.lt]: cutoffTime  // Only select users created more than 2 days ago
        }
      }
    });

    console.log('Unverified users older than 2 days removed from pendingUsers.');
  } catch (error) {
    console.error('Error in scheduled job:', error);
  }
});
