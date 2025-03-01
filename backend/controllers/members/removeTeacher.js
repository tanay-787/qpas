import { db, admin } from '../../config/firebase.js';
/**
 * Remove a teacher from an institution
 */
export const removeTeacher = async (req, res) => {
    try {
        const { institution_id, teacher_id } = req.params;

        const institutionRef = db.collection('institutions').doc(institution_id);
        await institutionRef.update({
            teacher_list: admin.firestore.FieldValue.arrayRemove(teacher_id),
        });

        const teacherRef = db.collection('users').doc(teacher_id);
        await teacherRef.update({
            role: admin.firestore.FieldValue.delete(),
            member_of: admin.firestore.FieldValue.delete(),
        });

        res.status(200).json({
            message: "Teacher removed successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove teacher.",
            error: error.message,
        });
    }
}