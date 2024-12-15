import { db } from '../../config/firebase.js';

/**
 * Fetch all institutions (For Searching)
 */
const getAllInstitutions = async (req, res) => {
    try {
      const institutions = [];
  
      const snapshot = await db.collection("institutions").get();
  
      snapshot.forEach((doc) => {
        institutions.push({ id: doc.id, ...doc.data() });
      });
  
      res.status(200).json(institutions);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch institutions.",
        error: error.message,
      });
    }
  };

  export { getAllInstitutions };