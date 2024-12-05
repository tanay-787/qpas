import { db } from '../config/firebase.js';

const createInstitution = async (req, res) => {
  const { name, logoUrl, createdBy } = req.body;

  try {
    const institutionRef = db.collection("institutions").doc();
    await institutionRef.set({
      name,
      logoUrl,
      createdBy: req.user.uid,
      teacher_list: [],
      student_list: [],
      created_at: new Date().toISOString(),
    });
    res.status(201).json({ id: institutionRef.id, message: "Institution created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to create institution.", error: error.message });
  }
};

const getInstitutions = async (req, res) => {
  try {
    const institutions = [];
    const snapshot = await db.collection("institutions").where("createdBy", "==", req.user.uid).get();
    snapshot.forEach((doc) => {
      institutions.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(institutions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch institutions.", error: error.message });
  }
};

const checkUserDetails = async(req, res) => {
  try{
      res.status(200).json({
          message: "User details fetched successfully",
          data: req.user
      });
  } catch (error) {
      res.status(500).json({
          message: "Internal Server Error",
          error: error.message
      });
  }
}

export { createInstitution, getInstitutions, checkUserDetails };
