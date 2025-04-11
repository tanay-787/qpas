import { db } from '../../config/firebase.js';

/**
 * Fetch institution that the user is a member of
 */
const getInstitutionByMemberOf = async (req, res) => {
  try {
    const snapshot = await db
      .collection("institutions")
      .where("inst_id", "==", req.userRecord.member_of)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No institutions found." });
    }

    // If there is at least one institution, get the first one
    const institutionDoc = snapshot.docs[0];
    const institution = institutionDoc.data();

   // Populate the createdBy field with the user object
    const creatorSnapshot = await db.collection('users').doc(institution.createdBy).get();
    if (creatorSnapshot.exists) {
      institution.createdBy = creatorSnapshot.data();
    } else {
      institution.createdBy = { // Handle case where creator doesn't exist (deleted user?)
        uid: institution.createdBy,
        displayName: 'Unknown User',
      };
      console.warn(`Creator with UID ${institution.createdBy} not found`);
    }

    res.status(200).json(institution);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch institutions.",
      error: error.message,
    });
  }
};

export { getInstitutionByMemberOf };
