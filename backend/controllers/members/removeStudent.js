import { db, admin } from '../../config/firebase.js';
// Import the notification utility
import { addNotification } from '../../utils/notificationUtils.js';

/**
 * Remove a student from an institution
 */
export const removeStudent = async (req, res) => {
    try {
        const { institution_id, student_id } = req.params;

        // Fetch institution document to get the name
        let institutionName;
        const institutionRef = db.collection('institutions').doc(institution_id);
        const institutionDoc = await institutionRef.get();

        if (!institutionDoc.exists) {
            console.warn(`Institution with ID ${institution_id} not found.`);
            // Still remove the student, but use a generic institution name
            institutionName = 'an institution';
        } else {
            institutionName = institutionDoc.data().name;
        }


        await institutionRef.update({
            student_list: admin.firestore.FieldValue.arrayRemove(student_id),
        });

        const studentRef = db.collection('users').doc(student_id);
         //Also delete the role and member_of from the student
        await studentRef.update({
            role: admin.firestore.FieldValue.delete(),
            member_of: admin.firestore.FieldValue.delete(),
        });

        res.status(200).json({
            message: "Student removed successfully.",
        });

          // Add notification *after* sending response (non-blocking)
        addNotification(
            student_id, // User ID of the removed student
            `You have been removed as a student from ${institutionName}.`,
            // No specific link for now
        );
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove student.",
            error: error.message,
        });
    }
}