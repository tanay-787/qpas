import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
});

const storage = admin.storage();
const db = admin.firestore();

export { admin, db, storage };
