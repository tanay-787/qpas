import { db, auth } from '../../config/firebase.js'; // assuming you're using Firebase Admin SDK for authentication

/**
 * Create a new institution
 */
const updateInstitution = async (req, res) => {
  const { name, logoUrl, description } = req.body;
  const userId = req.userRecord.uid; // The logged-in user's UID

  try {
    const institutionRef = db.collection("institutions").doc();

    // Use a default logo URL if none is provided
    const placeholderLogoUrl = "https://via.placeholder.com/150?text=Institution+Logo";

    // Create the institution document
    await institutionRef.set({
      inst_id: institutionRef.id, // Unique institution ID
      name,
      logoUrl: logoUrl || placeholderLogoUrl, // Default logo URL fallback
      createdBy: userId, // Reference to the user who created the institution
      teacher_list: [],
      student_list: [],
      created_at: new Date().toISOString(),
      description: description || "",
    });

    const userRef = db.collection('users').doc(userId);

    await userRef.update({
      role: 'admin', // Assign 'admin' role
      member_of: db.collection('institutions').doc(institutionRef.id), // Add the institution to the 'member_of' field
    });

    res.status(201).json({
      id: institutionRef.id,
      message: "Institution created successfully and user role updated.",
    });
  } catch (error) {
    console.error("Error creating institution:", error);
    res.status(500).json({
      message: "Failed to create institution and update user role.",
      error: error.message,
    });
  }
};

export { updateInstitution };
