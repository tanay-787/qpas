import { db } from '../config/firebase.js';

/**
 * Extracts user data from Firestore
 */

const extractUserData = () => async (req, res, next) => {
  try {
    // Use the UID from req.user to fetch user data from Firestore
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in the database.' });
    }

    const userData = userDoc.data();

    // Attach user data to the request object
    req.userRecord = userData;

    next();
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default extractUserData;
