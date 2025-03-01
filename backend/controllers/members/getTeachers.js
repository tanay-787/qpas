import { db, admin } from '../../config/firebase.js';
/**
 * Fetch the teachers for the institution
 */
export const getTeachers = async (req, res) => {
  try {
    const institutionId = req.params.institution_id;

    // Fetch institution document
    const institutionRef = db.collection('institutions').doc(institutionId);
    const institutionDoc = await institutionRef.get();

    if (!institutionDoc.exists) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    const institutionData = institutionDoc.data();

    // Get teacher UIDs from institution
    const teacherUIDs = institutionData.teacher_list || [];

    if (teacherUIDs.length === 0) {
      return res.status(200).json({ message: 'No teachers found' });
    }
    // Fetch user documents for teacher UIDs
    const usersSnapshot = await db.collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', teacherUIDs)
      .get();

    const teachersList = usersSnapshot.docs.map(doc => ({
      ...doc.data()
    }));

    

    res.status(200).json(teachersList);

  } catch (error) {
    res.status(500).json({ message: `Error fetching teachers: ${error.message}` });
  }
};
