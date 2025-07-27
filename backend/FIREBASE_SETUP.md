# 🔥 Firebase Setup Guide for Fanpuri

## Step 1: Create Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Click "Create a project"**
3. **Project name**: `fanpuri-app`
4. **Enable Google Analytics**: Optional (you can disable)
5. **Click "Create project"**

## Step 2: Enable Firestore Database

1. **In Firebase Console, go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

## Step 3: Enable Storage

1. **Go to "Storage" in Firebase Console**
2. **Click "Get started"**
3. **Choose "Start in test mode"**
4. **Select same location as Firestore**
5. **Click "Done"**

## Step 4: Get Service Account Key

1. **Go to Project Settings** (gear icon)
2. **Go to "Service accounts" tab**
3. **Click "Generate new private key"**
4. **Download the JSON file**
5. **Rename it to `serviceAccountKey.json`**
6. **Place it in the `backend` folder**

## Step 5: Update Environment Variables

Create a `.env` file in the backend folder:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# For production, you can use environment variables instead of serviceAccountKey.json
FIREBASE_TYPE=service_account
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
```

## Step 6: Update Package.json

Add a new script to `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server-firebase.js",
    "dev": "nodemon server-firebase.js"
  }
}
```

## Step 7: Test Firebase Connection

1. **Start the server**: `npm run dev`
2. **Check console**: Should see "Firebase Mode" message
3. **Test upload**: Try uploading a product through admin panel

## Step 8: Deploy to Render

1. **Update build command**: `cd backend && npm install`
2. **Update start command**: `cd backend && node server-firebase.js`
3. **Add environment variables** in Render dashboard
4. **Deploy**

## 🔧 Troubleshooting

### Common Issues:

1. **"Permission denied" errors**
   - Check Firestore and Storage rules
   - Make sure service account has proper permissions

2. **"Project not found" errors**
   - Verify project ID in service account key
   - Check environment variables

3. **Image upload fails**
   - Check Storage bucket name
   - Verify Storage rules allow uploads

### Firestore Rules (for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

### Storage Rules (for production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

## 🎯 Benefits of Firebase

- ✅ **Real-time updates**
- ✅ **Automatic scaling**
- ✅ **Built-in authentication**
- ✅ **Reliable image storage**
- ✅ **Free tier generous**
- ✅ **Easy deployment**

## 📊 Free Tier Limits

- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB downloads/day
- **Perfect for small to medium apps!** 