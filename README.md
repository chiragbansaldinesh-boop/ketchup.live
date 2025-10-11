# Ketchup Live - Location-Based Social Connection App

A React Native mobile app built with Expo that enables users to connect with people at the same venues in real-time.

## Features

- **Firebase Authentication** with Email/Password and Google Sign-In
- **Cloud Firestore** for user data and real-time updates
- **Location-based matching** - Connect with people at the same venues
- **Real-time chat** between matched users
- **Venue check-ins** with QR code scanning
- **User profiles** with photos and interests
- **Privacy controls** - Block users, hide venues
- **Session management** with automatic expiry

## Getting Started

### Quick Setup (10 minutes)

Follow the [**QUICK_START.md**](./QUICK_START.md) guide for a fast setup.

### Detailed Setup

For comprehensive instructions, see [**FIREBASE_SETUP.md**](./FIREBASE_SETUP.md).

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- A Firebase account (free tier works)
- iOS Simulator (Mac only) or Android Emulator, or physical device with Expo Go

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Configure Firebase (see [QUICK_START.md](./QUICK_START.md))

4. Start the development server:
   ```bash
   npm start
   ```

## Documentation

- [**QUICK_START.md**](./QUICK_START.md) - Get running in 10 minutes
- [**FIREBASE_SETUP.md**](./FIREBASE_SETUP.md) - Complete Firebase setup guide
- [**AUTHENTICATION_GUIDE.md**](./AUTHENTICATION_GUIDE.md) - How authentication works
- [**DEBUG_GUIDE.md**](./DEBUG_GUIDE.md) - Debugging tips

## Project Structure

```
project/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── settings/          # Settings screens
│   └── _layout.tsx        # Root layout with auth state
├── components/            # Reusable React components
├── config/               # Configuration files
│   └── firebase.ts       # Firebase initialization
├── services/             # Business logic
│   ├── firestoreService.ts    # Firestore operations
│   ├── googleAuthService.ts   # Google OAuth
│   └── privacyService.ts      # Privacy controls
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Technology Stack

- **Framework:** React Native with Expo SDK 53
- **Navigation:** Expo Router
- **Backend:** Firebase (Authentication + Firestore)
- **OAuth:** Expo AuthSession
- **State Management:** React hooks
- **Location:** Expo Location
- **Icons:** Lucide React Native
- **Styling:** React Native StyleSheet

## Authentication

This app uses Firebase Authentication with two methods:

1. **Email/Password** - Traditional authentication
2. **Google Sign-In** - OAuth 2.0 via Expo AuthSession

All user data is automatically synced to Cloud Firestore.

### How It Works

```
User Sign-In
    ↓
Firebase Authentication
    ↓
Create/Update Firestore User Document
    ↓
{
  uid: string,
  email: string,
  name: string,
  photoURL: string,
  lastLogin: Timestamp,
  ...
}
```

For implementation details, see [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md).

## Firestore Data Structure

### Collections

- `users` - User profiles and settings
- `venues` - Venue information
- `checkIns` - Active venue check-ins
- `matches` - User matches
- `messages` - Chat messages between matches

### Security Rules

Firestore security rules ensure:
- Users can only access their own data
- Matches are visible only to participants
- All operations require authentication

## Environment Variables

Required in `.env`:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

See `.env.example` for the complete list.

## Available Scripts

- `npm start` - Start Expo development server
- `npm run dev` - Alias for `npm start`
- `npm run build:web` - Build for web deployment
- `npm run lint` - Run ESLint

## Features Breakdown

### Authentication
- Email/password signup and login
- Google Sign-In with OAuth 2.0
- Automatic session persistence
- Secure logout with Firestore updates

### User Management
- Profile creation with photos and bio
- Interest tags
- Online/offline status
- Last seen timestamps

### Venue Features
- QR code scanning for check-ins
- Proximity detection (within 200 feet)
- Session timers with automatic expiry
- Venue discovery

### Privacy & Safety
- Block users
- Hide venues
- Report users
- Safety tips and resources
- Privacy policy

### Matching & Chat
- Swipe-based discovery
- Real-time matches
- Direct messaging
- Match history

## Platform Support

- ✅ **Web** - Full support
- ✅ **iOS** - Full support (requires Expo Go or development build)
- ✅ **Android** - Full support (requires Expo Go or development build)

**Note:** Google Sign-In works best on physical devices or with Expo Go.

## Troubleshooting

### Google Sign-In Not Working

**Error:** "Web Client ID not configured"

**Solution:**
- Add `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` to `.env`
- Restart Expo dev server

### Firestore Permission Denied

**Error:** "Missing or insufficient permissions"

**Solution:**
- Check Firestore security rules
- Ensure user is authenticated
- Verify user is accessing their own data

### Environment Variables Not Loading

**Solution:**
- Restart Expo dev server after changing `.env`
- Verify variable names start with `EXPO_PUBLIC_`
- Check for typos in `.env`

For more issues, see [DEBUG_GUIDE.md](./DEBUG_GUIDE.md).

## Production Deployment

Before deploying to production:

1. **Security:**
   - Update Firestore security rules to production mode
   - Configure OAuth consent screen in Google Cloud Console
   - Add authorized domains in Firebase settings

2. **Features:**
   - Enable email verification (optional)
   - Set up password reset flow
   - Add rate limiting for auth

3. **Monitoring:**
   - Set up error tracking (e.g., Sentry)
   - Enable Firebase Analytics
   - Monitor auth metrics in Firebase Console

4. **Testing:**
   - Test on real iOS and Android devices
   - Verify all authentication flows
   - Test edge cases and error states

## Contributing

This is a private project. For issues or questions, contact the project maintainer.

## License

Proprietary - All rights reserved

## Support

- Check the documentation guides in this repository
- Review Firebase Console for backend issues
- Check browser/device console for client errors

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Authentication by [Firebase](https://firebase.google.com/)
- Icons from [Lucide](https://lucide.dev/)
- Stock photos from [Pexels](https://pexels.com/)
