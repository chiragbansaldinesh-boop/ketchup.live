# Quick Start Guide - Firebase Authentication

Get your app running with Firebase Authentication in 10 minutes!

## Step 1: Install Dependencies (Already Done!)

The following packages are already installed:
- `firebase` - Firebase JavaScript SDK
- `expo-auth-session` - OAuth authentication
- `expo-crypto` - Cryptographic operations
- `expo-web-browser` - In-app browser for OAuth

## Step 2: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `ketchup-live` (or your choice)
4. Disable Google Analytics (optional, you can enable later)
5. Click **"Create project"**

## Step 3: Add Web App to Firebase

1. In your new Firebase project, click the **Web icon** `</>`
2. Register app name: `Ketchup Live`
3. Click **"Register app"**
4. **COPY** the config object that appears

## Step 4: Enable Authentication Methods

### Enable Email/Password

1. Click **Authentication** in left sidebar
2. Click **"Get started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"** ON
6. Click **"Save"**

### Enable Google Sign-In

1. Still in **"Sign-in method"** tab
2. Click **"Google"**
3. Toggle **"Enable"** ON
4. Select support email from dropdown
5. Click **"Save"**
6. **COPY** the **"Web client ID"** (you'll need this!)

## Step 5: Enable Firestore

1. Click **Firestore Database** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Select your region (choose closest to your users)
5. Click **"Enable"**

## Step 6: Configure Your App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and paste your values:

```bash
# From Step 3 (Firebase config object)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

# From Step 4 (Google Sign-in Web Client ID)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123...apps.googleusercontent.com
```

## Step 7: Start Your App

```bash
npm start
```

Press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Step 8: Test Authentication

### Test Signup
1. Open the app
2. Click **"Create Account"**
3. Fill in the form
4. Click **"Create Account"**
5. You should see a success message!

### Test Google Sign-In
1. Go back to login screen
2. Click **"Sign in with Google"**
3. Choose a Google account
4. Authorize the app
5. You should be logged in!

### Verify in Firebase
1. Go to Firebase Console
2. Click **Authentication** → **Users**
3. You should see your new users!
4. Click **Firestore Database**
5. Check the `users` collection - your user data is there!

## That's It!

You now have a fully functional authentication system with:
- ✅ Email/password registration
- ✅ Google Sign-In
- ✅ User data stored in Firestore
- ✅ Secure logout
- ✅ Session persistence

## What's Next?

### Improve Security (Recommended)

Update Firestore rules for production:

1. Go to **Firestore Database** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### Add More Features

Check out these guides:
- `FIREBASE_SETUP.md` - Complete setup guide
- `AUTHENTICATION_GUIDE.md` - Implementation details
- `README.md` - App overview

## Troubleshooting

**Problem:** Google Sign-In shows error

**Solution:**
- Make sure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is in `.env`
- Restart Expo dev server: `npm start`

**Problem:** "Permission denied" in Firestore

**Solution:**
- Check Firestore rules allow authenticated users
- Make sure user is logged in

**Problem:** Config not found

**Solution:**
- Check all variables in `.env` match `.env.example`
- No quotes needed around values in `.env`
- Restart Expo dev server after changing `.env`

## Need Help?

1. Check the detailed guides in the project root
2. Review Firebase Console for error messages
3. Check browser console for JavaScript errors
4. Verify all environment variables are set

## Visual Guide - Where to Find Things

### Firebase Console Navigation

```
Firebase Console (console.firebase.google.com)
│
├── 🔥 Project Overview
│   └── Add app (</> icon) → Get config object
│
├── 🔐 Authentication
│   ├── Users → See registered users
│   └── Sign-in method → Enable auth methods + Get Web Client ID
│
└── 📊 Firestore Database
    ├── Data → View user documents
    └── Rules → Security rules
```

### Your .env File Structure

```bash
# These 6 values come from Firebase config object
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...

# This comes from Authentication → Sign-in method → Google
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
```

Happy coding! 🚀
