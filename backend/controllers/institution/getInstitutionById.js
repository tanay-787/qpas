import { db } from '../../config/firebase.js';

/**
 * Fetch institutions created by the current user
 */
const getInstitutionById = async (req, res) => {
    try {
      const institutions = [];
  
      const snapshot = await db
        .collection("institutions")
        .where("createdBy", "==", req.userRecord.uid)
        .get();
  
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

  export { getInstitutionById };