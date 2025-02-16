import { db } from '../../config/firebase.js';

/**
 * Fetch all pending requests for teachers (Admin only)
 */
const getPendingRequests = async (req, res) => {
    const { institution_id } = req.params;
    const targettedRole = req.path.includes('teachers') ? 'teacher' : 'student';
    
    try {
      const requests = [];
      const snapshot = await db
        .collection('institutions')
        .doc(institution_id)
        .collection('waiting_lobby')
        .where('status', '==', 'pending')
        .where('role_requested', '==', targettedRole)
        .get();

      // Get all requests and their user data
      const requestPromises = snapshot.docs.map(async (doc) => {
        const requestData = doc.data();
        
        // Fetch user data for each request
        const userDoc = await db
          .collection('users')
          .doc(requestData.user_id)
          .get();

        // Return combined request and user data
        return {
          ...requestData,
          user: userDoc.exists ? userDoc.data() : null,
        };
      });

      // Wait for all user data to be fetched
      const requestsWithUsers = await Promise.all(requestPromises);
      
      res.status(200).json(requestsWithUsers);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch pending requests.',
        error: error.message,
      });
    }
};
  
export { getPendingRequests };