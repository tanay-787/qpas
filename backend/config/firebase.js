import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let serviceAccount;

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use `serviceAccountKey.json` in development, and environment variables in production
if (process.env.NODE_ENV === "development" || !process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Read the service account JSON file for local development
  try {
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  } catch (error) {
    console.error("Error reading service account file:", error);
    throw new Error("Failed to read serviceAccountKey.json: " + error.message);
  }
} else {
  // Parse the JSON string from the environment variable for production
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT: " + error.message);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
});

const storage = admin.storage();
const db = admin.firestore();

export { admin, db, storage };