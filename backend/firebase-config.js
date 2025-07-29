const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and save it as 'serviceAccountKey.json' in the backend folder

let serviceAccount;
try {
  serviceAccount = require('./fanpuri-107aa-firebase-adminsdk-fbsvc-f2d981fb78.json');
} catch (error) {
  // For development, you can use environment variables
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Let Firebase determine the correct bucket name automatically
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
  });
}

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

// Log Firebase configuration for debugging
console.log('Firebase initialized with:');
console.log('- Project ID:', serviceAccount.project_id);
console.log('- Storage Bucket:', bucket.name);
console.log('- Firestore initialized:', !!db);

module.exports = { admin, db, storage, bucket }; 