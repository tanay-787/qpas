import { db } from '../../config/firebase.js';

/**
 * Create a new institution
 */
const createInstitution = async (req, res) => {
    const { name, logoUrl } = req.body;
  
    try {
      const institutionRef = db.collection("institutions").doc();
  
      // Use a default logo URL if none is provided
      const placeholderLogoUrl = "https://via.placeholder.com/150?text=Institution+Logo";
  
      await institutionRef.set({
        inst_id: institutionRef.id, // Changed to inst_id
        name,
        logoUrl: logoUrl || placeholderLogoUrl, // Default logo URL fallback
        createdBy: req.userRecord.uid,
        teacher_list: [],
        student_list: [],
        created_at: new Date().toISOString(),
      });
  
      res.status(201).json({
        id: institutionRef.id,
        message: "Institution created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create institution.",
        error: error.message,
      });
    }
  };

  export { createInstitution };
  