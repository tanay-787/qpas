import { db } from '../../config/firebase.js';

/**
 * Fetch all pending requests for teachers (Admin only)
 */
const getPendingRequests = async (req, res) => {
    const { institution_id } = req.params;
  
    try {
      const requests = [];
      const snapshot = await db
        .collection('institutions')
        .doc(institution_id)
        .collection('waiting_lobby')
        .where('status', '==', 'pending')
        .get();
  
        snapshot.forEach((doc) => {
          requests.push(doc.data());
        });
        
  
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch pending requests.',
        error: error.message,
      });
    }
  };
  
  export { getPendingRequests };