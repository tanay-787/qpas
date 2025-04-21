import { db } from '../../config/firebase.js';

/**
 * Set or update the form definition for an institution
 */
const setFormDefinition = async (req, res) => {
  const { institution_id } = req.params;
  const { role, fields } = req.body;

  if (!role) {
    return res.status(400).json({
      message: 'Role is required.',
    });
  }

  if (!fields) {
    return res.status(400).json({
      message: 'Fields are required.',
    });
  }

  try {
    const institutionRef = db.collection('institutions').doc(institution_id);
    // Use a subcollection for form definitions, keyed by role
    const formDefinitionRef = institutionRef.collection('formDefinitions').doc(role);
    await formDefinitionRef.set({ fields: fields }, { merge: true });

    res.status(200).json({
      message: `Form definition for role ${role} updated successfully.`, });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update form definition.',
      error: error.message,
    });
  }
};

export { setFormDefinition };