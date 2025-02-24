import { db, storage } from "../../config/firebase.js";

export const getTeacherQuestionPapers = async (req, res) => {
  try {
    const { institution_id } = req.params;
    const uid = req.user.uid;

    // Query question papers
    const querySnapshot = await db
      .collection("questionPapers")
      .where("belongsTo", "==", institution_id)
      .where("createdBy", "==", uid)
      .get();

    // Map documents and get signed URLs
    const questionPapers = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const paperData = doc.data();

        // Generate a signed URL for the file if it exists
        if (paperData.documentPath) {
          const fileRef = storage.bucket().file(paperData.documentPath);
          const [url] = await fileRef.getSignedUrl({
            action: "read",
            expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
          });
          paperData.documentUrl = url;
        }

        return paperData;
      })
    );

    res.json(questionPapers);
  } catch (error) {
    console.error("Error fetching teacher's question papers:", error);
    res.status(500).json({ 
      message: "An error occurred while fetching question papers" 
    });
  }
};
