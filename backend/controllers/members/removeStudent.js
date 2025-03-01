import { db, admin } from '../../config/firebase.js';
/**
 * Remove a student from an institution
 */
export const removeStudent = async (req, res) => {
    try {
        const { institution_id, student_id } = req.params;

        const institutionRef = db.collection('institutions').doc(institution_id);
        await institutionRef.update({
            student_list: admin.firestore.FieldValue.arrayRemove(student_id),
        });

        const studentRef = db.collection('users').doc(studentId);
        await studentRef.update({
            role: admin.firestore.FieldValue.delete(),
            member_of: admin.firestore.FieldValue.delete(),
        });

        res.status(200).json({
            message: "Student removed successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove student.",
            error: error.message,
        });
    }
}