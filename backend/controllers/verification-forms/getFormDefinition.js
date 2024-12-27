import { db } from '../../config/firebase.js';

/**
 * Get the form definition for an institution
 */
const getFormDefinition = async (req, res) => {
  const { institution_id } = req.params;

  try {
    const institutionRef = db.collection('institutions').doc(institution_id);
    const doc = await institutionRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: 'Institution not found.',
      });
    }

    const { form_definition } = doc.data();
    res.status(200).json(form_definition);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve form definition.',
      error: error.message,
    });
  }
};

export { getFormDefinition };
