import { db, admin } from '../../config/firebase.js';

/**
 * Update the status of a request (approved or rejected)
 */
const updateRequestStatus = async (req, res) => {
  const { institution_id, request_id } = req.params; // Assuming request_id is passed as a URL parameter
  const { status } = req.body; // Expecting "approved" or "rejected"

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

    if (status === 'approved') {
      const institutionRef = db.collection('institutions').doc(institution_id);
      const roleField = requestData.role_requested === 'teacher' ? 'teacher_list' : 'student_list';

      await institutionRef.update({
        [roleField]: admin.firestore.FieldValue.arrayUnion(user_id),
      });

      res.status(200).json({ message: `User approved as ${requestData.role_requested}.` });
    } else if (status === 'rejected') {
      res.status(200).json({ message: 'Request rejected.' });
    } else {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    // Remove request from the lobby
    await requestRef.delete();
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      message: 'Failed to update request status.',
      error: error.message,
    });
  }
};

export { updateRequestStatus };
