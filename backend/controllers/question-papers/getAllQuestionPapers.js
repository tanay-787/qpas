import { db } from "../../config/firebase.js";
/**
 *  Fetches all question papers where accessType is "public"
 */
export const getAllQuestionPapers = async (req, res) => {
  try {
    const querySnapshot = await db
      .collection("questionPapers")
      .where("accessType", "==", "public")
      .get();

    // Map documents to an array
    const questionPapers = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      message: "Public question papers retrieved successfully",
      questionPapers,
    });
  } catch (error) {
    console.error("Error fetching question papers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch question papers",
      error: error.message,
    });
  }
};
