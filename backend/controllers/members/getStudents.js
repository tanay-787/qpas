import { db, admin } from '../../config/firebase.js';
/**
 * Fetch the Students for the institution
 */
export const getStudents = async (req, res) => {
  try {
    const { institution_id } = req.params;

    // Fetch institution document
    const institutionRef = db.collection('institutions').doc(institution_id);
    const institutionDoc = await institutionRef.get();

    if (!institutionDoc.exists) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    const institutionData = institutionDoc.data();

    // Get teacher UIDs from institution
    const studentUIDs = institutionData.student_list || [];

    if (studentUIDs.length === 0) {
      return res.status(200).json({ message: 'No Students found' });
    }
    // Fetch user documents for teacher UIDs
    const usersSnapshot = await db.collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', studentUIDs)
      .get();

    const studentDocs = usersSnapshot.docs.map(doc => ({
      ...doc.data()
    }));

    // Construct response
    const response = {
      institution_id,
      name: institutionData.name,
      studentsList: studentDocs,
    };

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ message: `Error fetching students: ${error.message}` });
  }
};

