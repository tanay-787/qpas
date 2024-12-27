import { db } from '../../config/firebase.js';
import { FieldPath } from 'firebase-admin/firestore';

/**
 * Fetch all institutions along with their creators' details.
 */
const getAllInstitutions = async (req, res) => {
  try {
    const institutions = [];
    const userRefs = new Set();

    // Fetch all institution documents
    const snapshot = await db.collection('institutions').get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      institutions.push({ ...data });
      if (data.createdBy) {
        userRefs.add(data.createdBy);
      }
    });

    // Fetch user details in batches
    const userDocs = await db.getAll(
      ...Array.from(userRefs).map((userId) => db.collection('users').doc(userId))
    );

    const users = {};
    userDocs.forEach((userDoc) => {
      if (userDoc.exists) {
        users[userDoc.id] = userDoc.data();
      }
    });

    // Attach user details to institutions
    const institutionsWithCreators = institutions.map((institution) => ({
      ...institution,
      createdBy: users[institution.createdBy] || null,
    }));

    res.status(200).json(institutionsWithCreators);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch institutions.',
      error: error.message,
    });
  }
};

export { getAllInstitutions };
