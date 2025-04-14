import { db, admin } from '../../config/firebase.js';
// Import the notification utility
import { addNotification } from '../../utils/notificationUtils.js';

/**
 * Remove a teacher from an institution
 */
export const removeTeacher = async (req, res) => {
    try {
        const { institution_id, teacher_id } = req.params;

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
            teacher_list: admin.firestore.FieldValue.arrayRemove(teacher_id),
        });

        const teacherRef = db.collection('users').doc(teacher_id);
        //Also delete the role and member_of from the teacher
        await teacherRef.update({
            role: admin.firestore.FieldValue.delete(),
            member_of: admin.firestore.FieldValue.delete(),
        });

        res.status(200).json({
            message: "Teacher removed successfully.",
        });

        // Add notification *after* sending response (non-blocking)
        addNotification(
            teacher_id, // User ID of the removed teacher
            `You have been removed as a teacher from ${institutionName}.`,
            'danger'
        );

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove teacher.",
            error: error.message,
        });
    }
}