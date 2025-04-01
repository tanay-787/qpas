import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
});

const storage = admin.storage();
const db = admin.firestore();

export { admin, db, storage };
