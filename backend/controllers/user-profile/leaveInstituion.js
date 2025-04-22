import { db, admin } from "../../config/firebase.js";

export const leaveInstitution = async (req, res) => {
  try {
    const userId = req.userRecord.uid;
    const institutionId = req.userRecord.member_of;
    const role = req.userRecord.role;
    const roleField = role === 'teacher' ? 'teacher_list' : 'student_list';

    const userRef = db.collection('users').doc(userId);
    const institutionRef = db.collection('institutions').doc(institutionId);

    const [userDoc, institutionDoc] = await Promise.all([
      userRef.get(),
      institutionRef.get()
    ]);

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!institutionDoc.exists) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin cannot leave the institution directly' });
    }

    // Remove user from the institution's role list
    await institutionRef.update({
      [roleField]: admin.firestore.FieldValue.arrayRemove(userId),
    });

    // Remove institution membership from user
    await userRef.update({
      member_of: admin.firestore.FieldValue.delete(),
      role: admin.firestore.FieldValue.delete(),
    });

    res.status(200).json({ message: 'User successfully left the institution' });
  } catch (error) {
    console.error('Error in leaveInstitution:', error);
    res.status(500).json({ message: 'An error occurred while leaving the institution' });
  }
};
