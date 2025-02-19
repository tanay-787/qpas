import { db, admin } from "../../config/firebase.js";

/**
 * Create a new Question Paper
 */
const createQuestionPaper = async (req, res) => {
    try {
        const { institution_id } = req.params;
        const authorId = req.userRecord.uid; // Logged-in user's UID

        const questionPaperRef = db
            .collection("institutions")
            .doc(institution_id)
            .collection("questionPapers")
            .doc();

        // Combine request body with extra metadata
        const questionPaperData = {
            ...req.body,
            qp_id: questionPaperRef.id,
            created_by: authorId,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            belongs_to: institution_id,
        };

        await questionPaperRef.set(questionPaperData);

        res.status(201).json({
            id: questionPaperRef.id,
            message: "Question paper created successfully.",
        });
    } catch (error) {
        console.error("Error creating question paper:", error);
        res.status(500).json({
            message: "Failed to create question paper.",
            error: error.message,
        });
    }
};

export { createQuestionPaper };