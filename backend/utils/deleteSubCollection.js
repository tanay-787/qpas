import { db } from "../config/firebase.js";

/**
 * Deletes all documents in a subcollection under a specific parent document.
 * @param {FirebaseFirestore.DocumentReference} parentRef - The parent document reference.
 * @param {string} subcollectionName - The name of the subcollection to delete.
 */
export const deleteSubCollection = async (parentRef, subcollectionName) => {
  try {
    const subcollectionSnapshot = await parentRef.collection(subcollectionName).get();

    if (subcollectionSnapshot.empty) {
      console.log(`[INFO] No documents found in subcollection '${subcollectionName}'`);
      return;
    }

    const batch = db.batch();
    
    subcollectionSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`[SUCCESS] Deleted '${subcollectionName}' subcollection`);
  } catch (error) {
    console.error(`[ERROR] Failed to delete subcollection '${subcollectionName}':`, error);
    throw error;
  }
};
