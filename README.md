# Ketchup Live - Location-Based Social Connection App

A React Native mobile app built with Expo that enables users to connect with people at the same venues in real-time.

## Features

- **Supabase Authentication** with Email/Password and Google Sign-In
- **Supabase Database** for user data and real-time updates
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

The app is pre-configured with Supabase. Your database tables are already set up and ready to use.

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account (free tier works)
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

3. Configure Supabase (see [QUICK_START.md](./QUICK_START.md))

4. Start the development server:
   ```bash
   npm start
   ```

## Documentation

- [**QUICK_START.md**](./QUICK_START.md) - Get running in 10 minutes
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
│   └── supabase.ts       # Supabase initialization
├── services/             # Business logic
│   ├── supabaseDatabaseService.ts  # Database operations
│   ├── supabaseAuthService.ts      # Authentication
│   └── privacyService.ts           # Privacy controls
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Technology Stack

- **Framework:** React Native with Expo SDK 53
- **Navigation:** Expo Router
- **Backend:** Supabase (Authentication + PostgreSQL Database)
- **OAuth:** Expo AuthSession
- **State Management:** React hooks
- **Location:** Expo Location
- **Icons:** Lucide React Native
- **Styling:** React Native StyleSheet

## Authentication

This app uses Supabase Authentication with two methods:

1. **Email/Password** - Traditional authentication
2. **Google Sign-In** - OAuth 2.0 via Expo AuthSession

All user data is automatically synced to Supabase PostgreSQL database.

### How It Works

```
User Sign-In
    ↓
Supabase Authentication
    ↓
Create/Update Profile in Database
    ↓
{
  id: uuid,
  email: string,
  full_name: string,
  photo_url: string,
  last_seen: timestamp,
  ...
}
```

For implementation details, see [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md).

## Database Structure

### Tables

- `profiles` - User profiles and settings
- `blocked_users` - Blocked user relationships
- `hidden_venues` - Hidden venue preferences
- `venues` - Venue information (to be created)
- `matches` - User matches (to be created)
- `messages` - Chat messages between matches (to be created)

### Security

Row Level Security (RLS) policies ensure:
- Users can only access their own data
- Matches are visible only to participants
- All operations require authentication

## Environment Variables

Required in `.env`:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
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
- Secure logout with database updates

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

**Solution:**
- Configure Google OAuth in Supabase Dashboard
- Restart Expo dev server

### Database Permission Denied

**Error:** "Missing or insufficient permissions"

**Solution:**
- Verify Row Level Security policies are enabled
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
   - Review Row Level Security policies
   - Configure OAuth providers in Supabase Dashboard
   - Set up custom domain (optional)

2. **Features:**
   - Enable email verification (optional)
   - Set up password reset flow
   - Add rate limiting for auth

3. **Monitoring:**
   - Set up error tracking (e.g., Sentry)
   - Monitor database performance
   - Review authentication logs in Supabase Dashboard

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
- Review Supabase Dashboard for backend issues
- Check browser/device console for client errors

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Backend by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
- Stock photos from [Pexels](https://pexels.com/)
