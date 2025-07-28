// Script to create admin users in Firebase
// Run this script to set up admin users for the admin panel

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Admin users to create
const adminUsers = [
  {
    email: 'fanpuriofficial@gmail.com',
    password: 'Ecaveentity123', // Change this to a secure password
    displayName: 'Fanpuri Admin'
  },
  {
    email: 'pradeepbarnalia123@gmail.com', // Replace with your email
    password: 'Arjun@07!', // Change this to a secure password
    displayName: 'Pradeep Admin'
  }
];

async function createAdminUsers() {
  try {
    for (const user of adminUsers) {
      try {
        const userRecord = await admin.auth().createUser({
          email: user.email,
          password: user.password,
          displayName: user.displayName,
          emailVerified: true
        });
        
        console.log(`✅ Successfully created admin user: ${user.email} (UID: ${userRecord.uid})`);
        
        // Set custom claims to mark as admin
        await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
        console.log(`✅ Set admin claims for: ${user.email}`);
        
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`⚠️  User already exists: ${user.email}`);
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update the ADMIN_EMAILS array in firebase-config.js with your admin emails');
    console.log('2. Test the admin panel login at http://localhost:5000/admin.html');
    
  } catch (error) {
    console.error('❌ Error in admin user creation:', error);
  }
}

createAdminUsers(); 