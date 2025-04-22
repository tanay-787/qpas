import { db, admin } from "../../config/firebase.js";
import { deleteSubCollection } from "../../utils/deleteSubCollection.js";


export const deleteInstitution = async (req, res) => {
    try {
        const userId = req.userRecord.uid;
        const userRole = req.userRecord.role;
        const institutionId = req.userRecord.member_of;
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete the institution' });
        }

        const institutionRef = db.collection('institutions').doc(institutionId);
        const institutionDoc = await institutionRef.get();

        if (!institutionDoc.exists) {
            return res.status(404).json({ message: "Institution not found" });
        }

        // ❗ Check for leftover question papers
        const qpSnapshot = await db
            .collection("questionPapers")
            .where("belongsTo", "==", institutionId)
            .limit(1)
            .get();

        if (!qpSnapshot.empty) {
            return res.status(400).json({
                message: "Institution still has question papers. Please delete them first before deleting the institution."
            });
        }


        const institutionData = institutionDoc.data();
        const allMemberIds = [
            ...(institutionData.teacher_list || []),
            ...(institutionData.student_list || []),
        ];

        // OPTIONAL: block deletion if any members still exist
        if (allMemberIds.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete institution with existing members. Please remove them first.',
            });
        }

        // Clean up admin user
        const adminUserRef = db.collection('users').doc(userId);
        await adminUserRef.update({
            member_of: admin.firestore.FieldValue.delete(),
            role: admin.firestore.FieldValue.delete(),
        });

        await deleteSubCollection(institutionRef, "formDefinitions");
        await deleteSubCollection(institutionRef, "waitingLobby");


        // Delete institution document
        await institutionRef.delete();

     

        res.status(200).json({ message: 'Institution successfully deleted' });

    } catch (error) {
        console.error('Error deleting institution:', error);
        res.status(500).json({ message: 'An error occurred while deleting the institution' });
    }
};