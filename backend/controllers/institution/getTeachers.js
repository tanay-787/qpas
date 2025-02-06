import { db } from '../../config/firebase.js';
import { admin } from '../../config/firebase.js';
/**
 * Fetch the teachers for the institution
 */
const getTeachers = async (req, res) => {
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

      // Fetch user documents for teacher UIDs
      const usersSnapshot = await db.collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', teacherUIDs)
        .get();

      const teacherDocs = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));

      // Construct response
      const response = {
        institution_id: institutionId,
        name: institutionData.name,
        teacher_list: teacherDocs,
      };

      res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: `Error fetching teachers: ${error.message}` });
      }
};

export { getTeachers };

