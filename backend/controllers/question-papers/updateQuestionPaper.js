import { db } from "../../config/firebase.js";

export const updateQuestionPaper = async (req, res) => {
  try {
    const { institution_id, qp_id } = req.params;
    const uid = req.userRecord.uid;
    const updates = req.body;

    // Get the question paper document
    const paperDoc = await db.collection("questionPapers").doc(qp_id).get();

    if (!paperDoc.exists) {
      return res.status(404).json({ message: "Question paper not found" });
    }

    const paperData = paperDoc.data();

    // Check if the user has permission to update this paper
    if (paperData.createdBy !== uid || paperData.belongsTo !== institution_id) {
      return res.status(403).json({ 
        message: "You don't have permission to update this question paper" 
      });
    }

    // Remove any fields that shouldn't be updated
    const safeUpdates = {
      ...updates,
    };

    delete safeUpdates.createdBy;
    delete safeUpdates.belongsTo;
    delete safeUpdates.documentPath;
    delete safeUpdates.createdAt;

    // Update the document in Firestore
    await db.collection("questionPapers").doc(qp_id).update(safeUpdates);

    // Get the updated document
    const updatedDoc = await db.collection("questionPapers").doc(qp_id).get();
    
    res.json({
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error("Error updating question paper:", error);
    res.status(500).json({ 
      message: "An error occurred while updating the question paper" 
    });
  }
};
