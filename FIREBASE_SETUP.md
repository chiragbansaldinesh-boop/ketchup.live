# Firebase Authentication Setup Guide

This guide will help you configure Firebase Authentication with Google Sign-In and Firestore for your React Native Expo app.

## Prerequisites

- A Firebase account
- Node.js and npm installed
- Expo CLI installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Once created, you'll be redirected to your project dashboard

## Step 2: Register Your Web App

1. In the Firebase Console, click on the **Web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Ketchup Live Web")
3. **Important:** Check "Also set up Firebase Hosting" if you want to deploy
4. Click "Register app"
5. Copy the Firebase configuration object - you'll need this later

Your config will look like this:

```javascript
{
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
}
```

## Step 3: Enable Authentication Methods

### Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Toggle **Enable** to ON
4. Click **Save**

### Enable Google Sign-In

1. In the same **Sign-in method** page, click on **Google**
2. Toggle **Enable** to ON
3. Select a **Project support email** from the dropdown
4. Click **Save**

## Step 4: Get Your Google Web Client ID

1. Still in the Google Sign-in settings, you'll see a **Web SDK configuration** section
2. Copy the **Web client ID** - this is what you need for `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
3. It will look like: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`

## Step 5: Enable Cloud Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in production mode** (for production)
   - For development, test mode is fine initially
   - We'll add security rules later
4. Select a Firestore location (choose one closest to your users)
5. Click **Enable**

### Set Up Firestore Security Rules

Once Firestore is created, go to the **Rules** tab and update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow users to read venue information
    match /venues/{venueId} {
      allow read: if request.auth != null;
      allow write: if false; // Only allow writes through admin SDK
    }

    // Check-ins: users can only read/write their own check-ins
    match /checkIns/{checkInId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Matches: users can read matches they're part of
    match /matches/{matchId} {
      allow read: if request.auth != null &&
        (resource.data.user1Id == request.auth.uid || resource.data.user2Id == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.user1Id == request.auth.uid || resource.data.user2Id == request.auth.uid);
    }

    // Messages: users can read/write messages in their matches
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.senderId == request.auth.uid;
    }
  }
}
```

Click **Publish** to save the rules.

## Step 6: Configure Your Expo App

### Update Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and paste your Firebase configuration:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Google OAuth Configuration (from Step 4)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

### Where to Find Each Value

| Variable | Where to Find It |
|----------|-----------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → General → Your apps → SDK setup and configuration |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same location as API Key |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Same location as API Key |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same location as API Key |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same location as API Key |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Same location as API Key |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration |

## Step 7: Test Your Setup

1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Open the app on web, iOS simulator, or Android emulator

3. Try the following:
   - Create an account with email/password
   - Sign in with Google
   - Check that user data is saved to Firestore
   - Sign out and sign back in

## Firestore Data Structure

When a user signs up or logs in, the following document is created/updated in the `users` collection:

```javascript
{
  uid: "<firebase-uid>",
  email: "user@example.com",
  name: "John Doe",
  displayName: "John Doe",
  photoURL: "https://example.com/photo.jpg",
  age: 25,
  bio: "",
  photos: ["https://example.com/photo.jpg"],
  interests: [],
  isOnline: true,
  lastSeen: Timestamp,
  lastLogin: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Troubleshooting

### Google Sign-In Not Working

1. **Error: "Web Client ID not configured"**
   - Make sure you've added `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` to your `.env` file
   - Restart your Expo development server after adding the variable

2. **Error: "redirect_uri_mismatch"**
   - This happens because Expo AuthSession uses a dynamic redirect URI
   - Make sure you're testing on a real device or using Expo Go
   - For production, you'll need to configure authorized redirect URIs in Google Cloud Console

3. **Error: "popup_closed_by_user"**
   - User cancelled the sign-in flow
   - This is expected behavior

### Firestore Permission Denied

1. **Error: "Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Make sure the user is authenticated
   - Verify the user is accessing their own data

### Email/Password Sign-In Issues

1. **Error: "auth/email-already-in-use"**
   - This email is already registered
   - User should use "Sign In" instead of "Sign Up"

2. **Error: "auth/weak-password"**
   - Password must be at least 6 characters

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)

## Production Considerations

Before deploying to production:

1. **Update Firestore Security Rules** to production mode
2. **Add proper error tracking** (e.g., Sentry)
3. **Configure OAuth consent screen** in Google Cloud Console
4. **Set up authorized domains** in Firebase Authentication settings
5. **Enable email verification** if required
6. **Set up proper backup** for Firestore data
7. **Monitor authentication metrics** in Firebase Console

## Need Help?

If you encounter any issues:

1. Check the [Firebase Console](https://console.firebase.google.com/) for error logs
2. Review the [Expo documentation](https://docs.expo.dev/)
3. Check the browser console for detailed error messages
4. Ensure all environment variables are set correctly
