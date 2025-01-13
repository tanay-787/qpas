import { db } from '../../config/firebase.js';

/**
 * Fetch the institution created by the current user
 */
const getInstitutionByUid = async (req, res) => {
  try {
    const snapshot = await db
      .collection("institutions")
      .where("createdBy", "==", req.userRecord.uid)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No institutions found." });
    }

    // If there is at least one institution, get the first one
    const institution = snapshot.docs[0].data();  // Get the first document from snapshot
    res.status(200).json(institution);  // Return as a single object

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch institutions.",
      error: error.message,
    });
  }
};

export { getInstitutionByUid };
