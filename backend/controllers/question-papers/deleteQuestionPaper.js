import { db, storage } from "../../config/firebase.js";

export const deleteQuestionPaper = async (req, res) => {
  try {
    const { institution_id, qp_id } = req.params;
    const uid = req.user.uid;

    // Get the question paper document
    const paperDoc = await db.collection("questionPapers").doc(qp_id).get();

    if (!paperDoc.exists) {
      return res.status(404).json({ message: "Question paper not found" });
    }

    const paperData = paperDoc.data();

    // Check if the user has permission to delete this paper
    if (paperData.createdBy !== uid || paperData.belongsTo !== institution_id) {
      return res.status(403).json({ 
        message: "You don't have permission to delete this question paper" 
      });
    }

    // Delete the file from storage if it exists
    if (paperData.documentPath) {
      const fileRef = storage.bucket().file(paperData.documentPath);
      await fileRef.delete().catch((error) => {
        console.error("Error deleting file from storage:", error);
      });
    }

    // Delete the document from Firestore
    await db.collection("questionPapers").doc(qp_id).delete();

    res.json({ message: "Question paper deleted successfully" });
  } catch (error) {
    console.error("Error deleting question paper:", error);
    res.status(500).json({ 
      message: "An error occurred while deleting the question paper" 
    });
  }
};

