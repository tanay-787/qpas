import { db } from '../../config/firebase.js';

/**
 * Set or update the form definition for an institution
 */
const setFormDefinition = async (req, res) => {
  const { institution_id } = req.params;
  const { form_definition } = req.body;

  try {
    const institutionRef = db.collection('institutions').doc(institution_id);
    await institutionRef.update({ form_definition });

    res.status(200).json({
      message: 'Form definition updated successfully.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update form definition.',
      error: error.message,
    });
  }
};

export { setFormDefinition };
