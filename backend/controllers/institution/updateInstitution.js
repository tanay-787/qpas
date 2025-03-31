import { db } from '../../config/firebase.js';

/**
 * Update an existing institution
 */
const updateInstitution = async (req, res) => {
  const updates = req.body; // Get all update fields from request body
  const userId = req.userRecord.uid; // The logged-in user's UID
  const { institution_id } = req.params; // Get institution ID from URL params

  try {
    // Get the institution document
    const institutionRef = db.collection("institutions").doc(institution_id);
    const institutionDoc = await institutionRef.get();

    // Check if institution exists
    if (!institutionDoc.exists) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // Check if user is authorized to update (should be the admin)
    const institutionData = institutionDoc.data();
    if (institutionData.createdBy !== userId) {
      return res.status(403).json({ message: "Not authorized to update this institution" });
    }

    // Create an object with only the fields that need to be updated
    const updateData = {};

    // Only add fields that were provided in the request
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.logoUrl !== undefined) updateData.logoUrl = updates.logoUrl;

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Update only the provided fields
    await institutionRef.update(updateData);

    res.status(200).json({
      message: "Institution updated successfully",
      updated: updateData
    });
  } catch (error) {
    console.error("Error updating institution:", error);
    res.status(500).json({
      message: "Failed to update institution",
      error: error.message,
    });
  }
};

export { updateInstitution };
