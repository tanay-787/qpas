import { db, admin, storage } from "../../config/firebase.js"; // Ensure storage is from firebase-admin
import multer from "multer";

// Configure multer for file uploads (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware for handling file uploads
export const uploadMiddleware = upload.single("file");

export const createQuestionPaper = async (req, res) => {
  try {
    // Destructure form fields
    const { name, subject, degree, examinationType, accessType } = req.body;
    const { institution_id } = req.params;
    const authorId = req.userRecord.uid;

    // Get file from multer
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Create a unique filename
    const filename = `${Date.now()}_${name}`;

    // Upload file to Firebase Storage using the Admin SDK
    const bucket = storage.bucket();
    const filePath = `question-papers/${institution_id}/${filename}`;
    const fileRef = bucket.file(filePath);

    // Create a write stream
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.end(file.buffer);

    // Wait for upload completion
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Save document data to Firestore
    const qpRef = db.collection("questionPapers").doc();
    await qpRef.set({
      qp_id: qpRef.id,
      name,
      subject,
      degree,
      examinationType,
      accessType,
      documentPath: filePath,
      createdBy: authorId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      belongsTo: institution_id,
    });

    return res.status(201).json({
      message: "Question paper created successfully",
    });
  } catch (error) {
    console.error("Error creating question paper:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create question paper",
      error: error.message,
    });
  }
};
