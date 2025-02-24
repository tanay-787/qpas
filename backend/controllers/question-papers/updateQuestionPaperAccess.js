import { db } from "../../config/firebase.js";

export const updateQuestionPaperAccess = async (req, res) => {
  try {
    const { institutionId, paperId } = req.params;
    const { accessType } = req.body;
    const uid = req.user.uid;

    if (!["public", "private"].includes(accessType)) {
      return res.status(400).json({
        message: "Invalid access type. Must be either 'public' or 'private'",
      });
    }

    // Get the question paper document
    const paperDoc = await db.collection("questionPapers").doc(paperId).get();

    if (!paperDoc.exists) {
      return res.status(404).json({ message: "Question paper not found" });
    }

    const paperData = paperDoc.data();

    // Check if the user has permission to update this paper
    if (paperData.createdBy !== uid || paperData.belongsTo !== institutionId) {
      return res.status(403).json({ 
        message: "You don't have permission to update this question paper" 
      });
    }

    // Update the access type
    await db.collection("questionPapers").doc(paperId).update({
      accessType,
      updatedAt: new Date().toISOString(),
    });

    // Get the updated document
    const updatedDoc = await db.collection("questionPapers").doc(paperId).get();
    
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error("Error updating question paper access:", error);
    res.status(500).json({ 
      message: "An error occurred while updating the question paper access" 
    });
  }
};

