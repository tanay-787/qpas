import { db } from '../../config/firebase.js';

/**
 * Update the status of a request (approved or rejected)
 */
const updateRequestStatus = async (req, res) => {
  const { institution_id } = req.params;
  const { status } = req.body; // Expecting "approved" or "rejected"
  const user_id = req.userRecord.uid; // Extract user ID from userRecord

  try {
    const lobbyRef = db
      .collection('institutions')
      .doc(institution_id)
      .collection('waiting_lobby');
    
    const snapshot = await lobbyRef.where('user_id', '==', user_id).limit(1).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Request not found in the waiting lobby.' });
    }

    const requestDoc = snapshot.docs[0];
    const requestData = requestDoc.data();

    if (status === 'approved') {
      const institutionRef = db.collection('institutions').doc(institution_id);
      const roleField = requestData.role_requested === 'teacher' ? 'teacher_list' : 'student_list';

      await institutionRef.update({
        [roleField]: db.FieldValue.arrayUnion(user_id),
      });

      res.status(200).json({ message: `User approved as ${requestData.role_requested}.` });
    } else if (status === 'rejected') {
      res.status(200).json({ message: 'Request rejected.' });
    }

    await requestDoc.ref.delete(); // Remove request from the lobby
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update request status.',
      error: error.message,
    });
  }
};

  export { updateRequestStatus };