# Authentication Implementation Guide

## Overview

This app uses **Firebase Authentication** with two sign-in methods:
1. **Email/Password** - Traditional authentication
2. **Google Sign-In** - OAuth via Expo AuthSession

All user data is stored in **Cloud Firestore**.

## File Structure

```
project/
├── config/
│   └── firebase.ts                 # Firebase initialization
├── services/
│   ├── firestoreService.ts         # Firestore CRUD operations
│   └── googleAuthService.ts        # Google OAuth handler
├── app/
│   ├── _layout.tsx                 # Auth state management
│   ├── auth/
│   │   ├── login.tsx               # Login screen
│   │   └── signup.tsx              # Signup screen
│   └── (tabs)/
│       └── profile.tsx             # Profile with logout
└── .env                            # Environment variables
```

## Key Features

### ✅ Authentication Methods
- Email/password registration and login
- Google Sign-In with OAuth 2.0
- Automatic session persistence
- Secure logout with Firestore update

### ✅ User Data Management
- Automatic Firestore user document creation
- First-time login: Creates new user record
- Subsequent logins: Updates `lastLogin` timestamp
- Logout: Updates `isOnline` and `lastSeen` fields

### ✅ Security
- Firebase Authentication handles password security
- Firestore security rules restrict data access
- Client-side form validation
- Error handling for all auth operations

## How It Works

### 1. Authentication Flow

```
User opens app
    ↓
Check auth state (onAuthStateChanged)
    ↓
┌─────────────┬─────────────┐
│ Not signed  │   Signed    │
│     in      │     in      │
└─────────────┴─────────────┘
      ↓               ↓
Login/Signup    Home Screen
   Screen
      ↓
  Sign In
      ↓
Create/Update Firestore user
      ↓
  Navigate to Home
```

### 2. Login Process

**Email/Password Login:**
```javascript
// 1. User enters email and password
// 2. Call Firebase signInWithEmailAndPassword()
// 3. On success, update Firestore user document
// 4. Navigate to home screen
```

**Google Sign-In:**
```javascript
// 1. User clicks "Sign in with Google"
// 2. Expo AuthSession opens Google OAuth flow
// 3. User authorizes in browser
// 4. Receive ID token from Google
// 5. Exchange token for Firebase credential
// 6. Sign in to Firebase with credential
// 7. Create/update Firestore user document
// 8. Navigate to home screen
```

### 3. Signup Process

```javascript
// 1. User fills registration form
// 2. Validate input (email format, password strength, etc.)
// 3. Call Firebase createUserWithEmailAndPassword()
// 4. Create Firestore user document with profile data
// 5. Navigate to home screen
```

### 4. Logout Process

```javascript
// 1. User clicks logout button
// 2. Show confirmation dialog
// 3. Update Firestore: isOnline = false, lastSeen = now
// 4. Call Firebase signOut()
// 5. Navigate to login screen
```

## Code Examples

### Initialize Firebase

```typescript
// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Check Auth State

```typescript
// app/_layout.tsx
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setIsLoading(false);
  });

  return unsubscribe;
}, []);
```

### Email/Password Login

```typescript
// app/auth/login.tsx
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async () => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  await firestoreService.createOrUpdateUser(
    userCredential.user.uid,
    userCredential.user.email,
    userCredential.user.displayName,
    userCredential.user.photoURL
  );
};
```

### Google Sign-In

```typescript
// app/auth/login.tsx
import { googleAuthService } from '@/services/googleAuthService';

const handleGoogleSignIn = async () => {
  const result = await googleAuthService.signInWithGoogle();

  if (result.success && result.user) {
    await firestoreService.createOrUpdateUser(
      result.user.uid,
      result.user.email,
      result.user.displayName,
      result.user.photoURL
    );
  }
};
```

### Create/Update User in Firestore

```typescript
// services/firestoreService.ts
async createOrUpdateUser(
  uid: string,
  email: string,
  displayName: string | null,
  photoURL: string | null
) {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      isOnline: true,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Create new user
    await setDoc(userRef, {
      uid,
      email,
      name: displayName || email.split('@')[0],
      photoURL: photoURL || '',
      // ... other fields
      createdAt: serverTimestamp(),
    });
  }
}
```

### Logout

```typescript
// app/(tabs)/profile.tsx
import { signOut } from 'firebase/auth';

const handleLogout = async () => {
  // Update Firestore
  await firestoreService.updateUser(auth.currentUser.uid, {
    isOnline: false,
    lastSeen: new Date(),
  });

  // Sign out from Firebase
  await signOut(auth);

  // Navigate to login
  router.replace('/auth/login');
};
```

## Environment Variables

Required variables in `.env`:

```bash
# Firebase Config (from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Google OAuth (from Firebase Console → Authentication → Google)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

## Firestore Collections

### `users` Collection

Document ID: Firebase UID

```javascript
{
  uid: string,              // Firebase user ID
  email: string,            // User email
  name: string,             // Display name
  displayName: string,      // Full display name
  photoURL: string,         // Profile photo URL
  age: number,              // User age
  bio: string,              // User bio
  photos: string[],         // Array of photo URLs
  interests: string[],      // User interests
  location: GeoPoint,       // Current location (optional)
  currentVenue: string,     // Current venue ID (optional)
  isOnline: boolean,        // Online status
  lastSeen: Timestamp,      // Last activity timestamp
  lastLogin: Timestamp,     // Last login timestamp
  createdAt: Timestamp,     // Account creation timestamp
  updatedAt: Timestamp      // Last update timestamp
}
```

### Other Collections

- `venues` - Venue information
- `checkIns` - User check-ins at venues
- `matches` - User matches
- `messages` - Chat messages

See `services/firestoreService.ts` for complete data models.

## Security Rules

Firestore security rules ensure:
- Users can only read/write their own data
- Authenticated access required for all operations
- Matches and messages restricted to participants

Example rule:

```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

## Error Handling

Common Firebase auth errors:

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| `auth/email-already-in-use` | Email registered | "This email is already registered" |
| `auth/user-not-found` | No account exists | "No account found with this email" |
| `auth/wrong-password` | Incorrect password | "Incorrect password" |
| `auth/weak-password` | Password too short | "Password must be at least 6 characters" |
| `auth/invalid-email` | Invalid email format | "Invalid email address" |
| `auth/too-many-requests` | Rate limited | "Too many attempts. Try again later" |

## Testing

### Test Email/Password Auth
1. Go to signup screen
2. Fill in the form
3. Click "Create Account"
4. Check Firestore for new user document
5. Logout and login again
6. Verify `lastLogin` is updated

### Test Google Sign-In
1. Go to login screen
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Check Firestore for user document
5. Verify profile photo and name are saved

### Test Logout
1. Click logout from profile
2. Verify confirmation dialog appears
3. Confirm logout
4. Check Firestore: `isOnline` should be `false`
5. Verify redirect to login screen

## Troubleshooting

### Google Sign-In fails
- Check `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set
- Verify Web Client ID is from Firebase Console
- Restart Expo dev server after adding env var

### Firestore permission denied
- Check security rules in Firebase Console
- Verify user is authenticated
- Ensure user is accessing their own data

### User not navigating after login
- Check auth state listener in `_layout.tsx`
- Verify Firestore operation completes successfully
- Check for JavaScript errors in console

## Production Checklist

Before deploying:

- [ ] Update Firestore security rules to production mode
- [ ] Configure OAuth consent screen in Google Cloud
- [ ] Add authorized domains in Firebase settings
- [ ] Enable email verification (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test on real devices
- [ ] Add loading states for better UX
- [ ] Implement password reset flow
- [ ] Add rate limiting for auth attempts

## Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Expo AuthSession Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
