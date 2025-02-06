import { db, admin } from '../../config/firebase.js';

/**
 * Update the status of a request (approved or rejected)
 */
const updateRequestStatus = async (req, res) => {
  const { institution_id, request_id, action } = req.params; // Assuming request_id is passed as a URL parameter
 // Expecting "approve" or "reject"

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

    if (action === 'approve') {
      const institutionRef = db.collection('institutions').doc(institution_id);
      const roleField = requestData.role_requested === 'teacher' ? 'teacher_list' : 'student_list';

      await institutionRef.update({
        [roleField]: admin.firestore.FieldValue.arrayUnion(user_id),
      });

      const userRef = db.collection('users').doc(user_id);

      await userRef.update({
        role: requestData.role_requested,
        member_of: institution_id,
      });
      
      res.status(200).json({ message: `User approved as ${requestData.role_requested}.` });
      await requestRef.delete();
    } else if (action === 'reject') {
      res.status(200).json({ message: 'Request rejected.' });
      await requestRef.delete();
    } else {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      message: 'Failed to update request status.',
      error: error.message,
    });
  }
};

export { updateRequestStatus };
