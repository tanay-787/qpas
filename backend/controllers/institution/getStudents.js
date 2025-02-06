import { db } from '../../config/firebase.js';
import { admin } from '../../config/firebase.js';
/**
 * Fetch the students for the institution
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
    
    // Get student UIDs from institution
    const studentUIDs = institutionData.student_list || [];

    // Fetch user documents for student UIDs
    const usersSnapshot = await db.collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', studentUIDs)
      .get();

    const studentDocs = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    // Construct response
    const response = {
        institution_id: institutionId,
        name: institutionData.name,
        student_list: studentDocs, // Replace UIDs with user docs
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getTeachers };

