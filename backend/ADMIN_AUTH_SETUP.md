# Admin Authentication Setup Guide

This guide will help you set up authentication for the Fanpuri admin panel.

## 🔐 What We've Implemented

- **Firebase Authentication** for admin panel access
- **Email/Password login** system
- **Admin-only access** - only authorized emails can access the admin panel
- **Secure logout** functionality
- **Access denied** page for unauthorized users

## 📋 Prerequisites

1. **Firebase Project** - You already have this set up
2. **Firebase Admin SDK** - You'll need to download the service account key

## 🚀 Setup Steps

### Step 1: Download Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `fanpuri-107aa` project
3. Go to **Project Settings** (gear icon)
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file and save it as `serviceAccountKey.json` in the `backend` folder

### Step 2: Install Firebase Admin SDK

```bash
cd fanpuri-app/backend
npm install firebase-admin
```

### Step 3: Create Admin Users

1. **Update the admin emails** in `create-admin-user.js`:
   ```javascript
   const adminUsers = [
     {
       email: 'your-email@example.com', // Replace with your email
       password: 'YourSecurePassword123!', // Change to a secure password
       displayName: 'Your Name'
     }
   ];
   ```

2. **Run the script** to create admin users:
   ```bash
   node create-admin-user.js
   ```

### Step 4: Update Admin Email List

1. **Edit** `public/firebase-config.js`
2. **Update** the `ADMIN_EMAILS` array with your admin emails:
   ```javascript
   const ADMIN_EMAILS = [
     'your-email@example.com',
     'admin@fanpuri.com'
   ];
   ```

### Step 5: Test the Admin Panel

1. **Start your backend server**:
   ```bash
   npm run dev
   ```

2. **Visit** `http://localhost:5000/admin.html`

3. **Login** with your admin credentials

## 🔒 Security Features

- ✅ **Email-based access control** - Only listed emails can access
- ✅ **Firebase Authentication** - Secure login system
- ✅ **Automatic logout** - Session management
- ✅ **Access denied** - Clear feedback for unauthorized users
- ✅ **Logout button** - Easy session termination

## 📁 Files Modified

- `public/admin.html` - Added Firebase SDK and logout button
- `public/edit-product.html` - Added Firebase SDK
- `public/firebase-config.js` - Firebase configuration and auth logic
- `create-admin-user.js` - Script to create admin users
- `ADMIN_AUTH_SETUP.md` - This setup guide

## 🛠️ Customization

### Adding More Admin Users

1. **Add emails** to the `ADMIN_EMAILS` array in `firebase-config.js`
2. **Create users** using the `create-admin-user.js` script
3. **Test access** with the new admin accounts

### Changing Password

1. **Go to Firebase Console** → Authentication → Users
2. **Find your user** and click the three dots
3. **Select "Reset password"** to send a reset email

### Removing Admin Access

1. **Remove email** from `ADMIN_EMAILS` array in `firebase-config.js`
2. **User will see "Access Denied"** when trying to login

## 🔧 Troubleshooting

### "Access Denied" Error
- Check if your email is in the `ADMIN_EMAILS` array
- Verify the email spelling and case

### "User not found" Error
- Run the `create-admin-user.js` script to create the user
- Check Firebase Console → Authentication → Users

### Firebase SDK Loading Issues
- Check internet connection
- Verify Firebase project configuration
- Check browser console for errors

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Firebase project settings
3. Ensure all files are properly configured
4. Test with a different browser

---

**🎉 Your admin panel is now secure and ready to use!** 