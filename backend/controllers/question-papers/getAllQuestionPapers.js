import { db, storage } from "../../config/firebase.js";

/**
 *  Fetches all question papers and includes:
 *  - Institution details in `belongsTo`
 *  - Creator details in `createdBy`
 *  - A signed URL for accessing the document
 */
export const getAllQuestionPapers = async (req, res) => {
  try {
    const querySnapshot = await db.collection("questionPapers").get();

    // Map documents to an array and fetch related details
    const questionPapers = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const paperData = doc.data();
        const institutionId = paperData.belongsTo;
        const createdByUid = paperData.createdBy;
        const documentPath = paperData.documentPath; // Storage path

        let institutionData = { inst_id: institutionId, name: null, logoUrl: null };
        let createdByData = { uid: createdByUid, displayName: null };

        // Fetch institution details
        if (institutionId) {
          const instDoc = await db.collection("institutions").doc(institutionId).get();
          if (instDoc.exists) {
            const instData = instDoc.data();
            institutionData = {
              inst_id: institutionId,
              name: instData.name || null,
              logoUrl: instData.logoUrl || null,
            };
          }
        }

        // Fetch creator details
        if (createdByUid) {
          const userDoc = await db.collection("users").doc(createdByUid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            createdByData = {
              uid: createdByUid,
              displayName: userData.displayName || null,
            };
          }
        }

        // Generate a signed URL for the file
        if (documentPath) {
          const fileRef = storage.bucket().file(documentPath);
          try {
            const [url] = await fileRef.getSignedUrl({
              action: "read",
              expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
            });
            paperData.documentURL = url;
          } catch (error) {
            console.error(`Failed to generate signed URL for ${documentPath}:`, error);
          }
        }

        return {
          ...paperData,
          belongsTo: institutionData, // Attach institution details
          createdBy: createdByData,   // Attach creator details              // Include signed URL
        };
      })
    );

    return res.status(200).json({
      message: "All question papers retrieved successfully",
      questionPapers,
    });
  } catch (error) {
    console.error("Error fetching question papers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch question papers",
      error: error.message,
    });
  }
};
