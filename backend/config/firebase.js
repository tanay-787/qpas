import admin from "firebase-admin";

// Initialize Firebase Admin with environment variables
let serviceAccount;

// Parse the JSON string from environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
});

const storage = admin.storage();
const db = admin.firestore();

export { admin, db, storage };
