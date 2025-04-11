import { db, admin } from '../config/firebase.js'; // Import db and admin

/**
 * Adds a notification document to a user's notification subcollection in Firestore.
 *
 * @param {string} userId - The UID of the user to notify.
 * @param {string} message - The notification message content.
 * @param {string|null} [link=null] - An optional URL path for the notification link (e.g., '/dashboard/requests').
 * @returns {Promise<void>} A promise that resolves when the notification is added or rejects on error.
 */
async function addNotification(userId, message, link = null) {
  if (!userId || !message) {
    console.error("Error adding notification: userId and message are required.");
    return; // Or throw an error
  }

  const notificationData = {
    message: message,
    read: false,
    timestamp: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp for ordering
    link: link, // Will be null if not provided
  };

  try {
    const userNotificationsRef = db
      .collection('users')
      .doc(userId)
      .collection('notifications');

    await userNotificationsRef.add(notificationData);
    console.log(`Notification added for user ${userId}: "${message}"`);
  } catch (error) {
    console.error(`Error adding notification for user ${userId}:`, error);
    // Depending on your error handling strategy, you might want to re-throw the error
    // throw error;
  }
}

export { addNotification };
