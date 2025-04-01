import admin from "firebase-admin";
import serviceAccountDev from "./serviceAccountKey.json" assert { type: "json" };

let serviceAccount;

// Use `serviceAccountKey.json` in development, and environment variables in production
if (process.env.NODE_ENV === "development") {
  // Import the service account JSON file for local development
  serviceAccount = serviceAccountDev;
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parse the JSON string from the environment variable for production
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT: " + error.message);
  }
} else {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is required in production");
}

// Debugging log
console.log("Service Account:", serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
});

const storage = admin.storage();
const db = admin.firestore();

export { admin, db, storage };