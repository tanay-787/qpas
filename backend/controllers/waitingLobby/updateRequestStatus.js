import { db, admin } from '../../config/firebase.js';
// Import the notification utility
import { addNotification } from '../../utils/notificationUtils.js';

/**
 * Update the status of a request (approved or rejected)
 */
const updateRequestStatus = async (req, res) => {
  const { institution_id, request_id, action } = req.params;

  try {
    const requestRef = db
      .collection('institutions')
      .doc(institution_id)
      .collection('waiting_lobby')
      .doc(request_id);

    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ message: 'Request not found in the waiting lobby.' });
    }

    const requestData = requestDoc.data();
    const user_id = requestData.user_id; // User ID from the request data
    const roleRequested = requestData.role_requested;

    // Get institution name for clearer messages (optional but recommended)
    let institutionName = 'the institution'; // Default name
    try {
        const institutionDoc = await db.collection('institutions').doc(institution_id).get();
        if (institutionDoc.exists) {
            institutionName = institutionDoc.data().name || institutionName;
        }
    } catch (instError) {
        console.warn("Could not fetch institution name for notification:", instError);
    }


    if (action === 'approve') {
      const institutionRef = db.collection('institutions').doc(institution_id);
      const roleField = roleRequested === 'teacher' ? 'teacher_list' : 'student_list';

      // Add user to the institution's role list
      await institutionRef.update({
        [roleField]: admin.firestore.FieldValue.arrayUnion(user_id),
      });

      // Update user's role and member_of status
      const userRef = db.collection('users').doc(user_id);
      await userRef.update({
        role: roleRequested,
        member_of: institution_id,
      });

      // Delete the request *after* everything else succeeds
      await requestRef.delete();

      // Send success response
      res.status(200).json({ message: `User approved as ${roleRequested}.` });

      // Add notification *after* sending response (non-blocking)
      addNotification(
        user_id,
        `Your request to join "${institutionName}" as a ${roleRequested} has been approved.`,
        'success'
      );

    } else if (action === 'reject') {
      // Just delete the request
      await requestRef.delete();

      // Send success response
      res.status(200).json({ message: 'Request rejected.' });

       // Add notification *after* sending response (non-blocking)
      addNotification(
        user_id,
        `Your request to join "${institutionName}" as a ${roleRequested} has been rejected.`
        // Optional: Link to browse institutions page or null
        // '/browse-institutions'
      ); // No link needed, or could link to browse page

    } else {
      return res.status(400).json({ message: 'Invalid action provided.' });
    }

  } catch (error) {
    console.error('Error updating request status:', error);
    // Avoid sending detailed Firestore errors to the client
    res.status(500).json({
      message: 'Failed to update request status.'
    });
  }
};

export { updateRequestStatus };
