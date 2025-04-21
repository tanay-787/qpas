import { db } from "../../config/firebase.js"; // assuming you're using Firebase Admin SDK for authentication

/**
 * Create a new institution
 */
const createInstitution = async (req, res) => {
  const { name, logoUrl, description } = req.body;
  const userId = req.userRecord.uid; // The logged-in user's UID

  try {
    //Check for is there a insitution with the same createdBy, and if there is, throw an error
    const existingInstitution = await db
      .collection("institutions")
      .where("createdBy", "==", userId)
      .get();

    if (!existingInstitution.empty) {
      return res.status(400).json({
        message: "User is already an Admin of a different institution",
      });
    }
    // Create a new institution document
    const institutionRef = db.collection("institutions").doc();

    // Use a default logo URL if none is provided
    const placeholderLogoUrl = "https://placehold.co/150?text=Institution+Logo";

    // Create the institution document
    await institutionRef.set({
      name,
      inst_id: institutionRef.id, // Unique institution ID
      logoUrl: logoUrl || placeholderLogoUrl, // Default logo URL fallback
      createdBy: userId, // Reference to the user who created the institution
      teacher_list: [],
      student_list: [],
      created_at: new Date().toISOString(),
      description: description || "",
    });

    const userRef = db.collection("users").doc(userId);

    await userRef.update({
      role: "admin", // Assign 'admin' role
      member_of: institutionRef.id, // Add the institution to the 'member_of' field
    });

    res.status(201).json({
      inst_id: institutionRef.id,
      name: name,
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

export { createInstitution };
