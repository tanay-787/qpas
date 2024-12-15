import { db } from '../../config/firebase.js';

/**
 * Add a user to the waiting lobby of a specific institution
 */
const addToWaitingLobby = async (req, res) => {
  const { institution_id } = req.params; // Extract institution ID from params
  const { role_requested } = req.body;

  try {
    const user_id = req.userRecord.uid; // Extract user ID from userRecord

    const lobbyRef = db
      .collection('institutions')
      .doc(institution_id)
      .collection('waiting_lobby');

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
      user_id,
      role_requested,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Request added to the institution\'s waiting lobby.',
      id: newRequestRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add request to waiting lobby.',
      error: error.message,
    });
  }
};

export { addToWaitingLobby };