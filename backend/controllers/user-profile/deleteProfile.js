import { db, admin } from "../../config/firebase.js";
import { deleteSubCollection } from "../../utils/deleteSubCollection.js";

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.userRecord.uid;
    const userRef = db.collection("users").doc(userId);

    // Step 1: Get user data
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userSnap.data();

    if(userData.role === "admin"){
        return res.status(500).json({message: "You cannot delete the acocunt directly without leaving the institution"})
    }

    if (userData.role === "teacher") {
        const papersQuery = await db
          .collection("questionPapers")
          .where("createdBy", "==", userId)
          .get();
      
        const batch = db.batch();
      
        papersQuery.forEach((doc) => {
            batch.update(doc.ref, {
                isCreatorDeleted: true,
              });              
        });
      
        await batch.commit();
      }      

    // Step 2: Remove user from institution list
    if (userData.member_of && userData.role) {
      const institutionRef = db.collection("institutions").doc(userData.member_of);
      const roleField = userData.role === "teacher" ? "teacher_list" : "student_list";

      await institutionRef.update({
        [roleField]: admin.firestore.FieldValue.arrayRemove(userId),
      });
    }

    // Step 3: Delete subcollections like drafts, uploads, etc.
    await deleteSubCollection(userRef, 'notifications');

    // Step 4: Delete the user document
    await userRef.delete();

    // Step 5: Optionally, delete the user from Firebase Authentication
    await admin.auth().deleteUser(userId);

    return res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return res.status(500).json({ message: "An error occurred while deleting the profile" });
  }
};