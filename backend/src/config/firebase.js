const admin = require('firebase-admin');
require('dotenv').config();

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 * @returns {Promise<boolean>} Success status
 */
const initializeFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (firebaseApp) {
      return true;
    }

    // Check if service account key is provided
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_KEY not provided, push notifications will be disabled');
      return false;
    }

    // Parse service account key (can be JSON string or path to file)
    let serviceAccount;
    try {
      // Try to parse as JSON string
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      // If parsing fails, try to read from file path
      const fs = require('fs');
      const path = require('path');
      const keyPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      if (fs.existsSync(keyPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      } else {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not a valid JSON string or file path');
      }
    }

    // Initialize Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    // Firebase bağlantısı olmadan da çalışabilir (optional)
    return false;
  }
};

/**
 * Get Firebase Admin instance
 * @returns {admin.app.App|null} Firebase app instance
 */
const getFirebaseApp = () => {
  return firebaseApp;
};

/**
 * Get Firebase Messaging instance
 * @returns {admin.messaging.Messaging|null} Messaging instance
 */
const getMessaging = () => {
  if (!firebaseApp) {
    return null;
  }
  return admin.messaging();
};

module.exports = {
  initializeFirebase,
  getFirebaseApp,
  getMessaging,
};

