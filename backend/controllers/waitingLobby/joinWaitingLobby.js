import { db } from '../../config/firebase.js';

/**
 * Add a user to the waiting lobby of a specific institution
 */
const joinWaitingLobby = async (req, res) => {
  const { institution_id } = req.params; // Extract institution ID from params
  const { role_requested } = req.body;

  try {
    const user_id = req.userRecord.uid; // Extract user ID from userRecord
    const userRole = req.userRecord.role;
    const member_of = req.userRecord.member_of;

    // Check if the user is already a member of the institution
    if (userRole && member_of) {
      return res.status(400).json({
        message: `User is already associated to an institution.`,
      });
    }


    const lobbyRef = db
      .collection('institutions')
      .doc(institution_id)
      .collection('waiting_lobby');

    // Check if the user already has a pending request in the waiting lobby
    const existingRequest = await lobbyRef
      .where('user_id', '==', user_id)
      .get();

    if (!existingRequest.empty) {
      return res.status(400).json({
        message: 'User already has a pending request in this institution\'s waiting lobby.',
      });
    }

    const newRequestRef = lobbyRef.doc();
    await newRequestRef.set({
      request_id: newRequestRef.id, // Unique request ID
      user_id,
      role_requested,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Request added to the institution\'s waiting lobby.',
      request_id: newRequestRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add request to waiting lobby.',
      error: error.message,
    });
  }
};

export { joinWaitingLobby };
