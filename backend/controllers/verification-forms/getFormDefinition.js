import { db } from '../../config/firebase.js';

/**
 * Get the form definition for an institution
 */
const getFormDefinition = async (req, res) => {
  const { institution_id } = req.params;
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({
      message: 'Role is required.',
    });
  }

  try {
    const institutionRef = db.collection('institutions').doc(institution_id);
        // Use a subcollection for form definitions, keyed by role
    const formDefinitionRef = institutionRef.collection('formDefinitions').doc(role);
    const doc = await formDefinitionRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: `Form definition for role ${role} not found.`,
      });
    }
    
    const { fields } = doc.data();
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve form definition.',
      error: error.message,
    });
  }
};

export { getFormDefinition };