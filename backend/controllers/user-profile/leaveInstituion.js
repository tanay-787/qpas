const { db, admin } = require('../../config/firebase');
const leaveInstitution = async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.user.uid;

    // Get the institution ID from the request body
    const institutionId = req.userRecord.belongsTo;

    // Get references to the user and institution documents
    const userRef = db.collection('users').doc(userId);
    const institutionRef = db.collection('institutions').doc(institutionId);

    // Check if the user and institution exist
    const userDoc = await userRef.get();
    const institutionDoc = await institutionRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!institutionDoc.exists) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    // Remove the user ID from the institution's members array and the institution ID from the user's institutions array using FieldValue.arrayRemove
    await institutionRef.update({
      members: admin.firestore.FieldValue.arrayRemove(userId),
    });

    await userRef.update({
      institutions: admin.firestore.FieldValue.arrayRemove(institutionId),
    });

    // Return a success message
    res.status(200).json({ message: 'User successfully left the institution' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while leaving the institution' });
  }
};

module.exports = leaveInstitution;