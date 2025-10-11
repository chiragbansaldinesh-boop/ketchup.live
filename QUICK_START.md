# Quick Start Guide - Supabase Setup

Get your Ketchup Live app running in 10 minutes!

## Current Status

Your app is already configured with Supabase and the database tables are set up. You're ready to start using the app!

## What's Already Done

- Supabase project is created and connected
- Database tables are created (profiles, blocked_users, hidden_venues)
- Row Level Security (RLS) policies are enabled
- Authentication is configured
- Environment variables are set

## Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Verify Configuration

Your `.env` file should already contain:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://dhjwbdspacnppawlbasq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Start the Development Server

```bash
npm start
```

Press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Test Your App

### Create an Account
1. Open the app
2. Click "Create Account"
3. Fill in your email and password
4. Click "Create Account"
5. You should see a success message!

### Test Login
1. Go back to login screen
2. Enter your credentials
3. Click "Sign In"
4. You should be logged in!

### Verify in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Authentication** → **Users**
4. You should see your new user!
5. Click **Table Editor** → **profiles**
6. Your user profile data is there!

## Understanding Your Setup

### Database Tables

#### profiles
Stores user profile information:
- id (uuid) - Links to auth.users
- email, full_name, display_name
- photo_url, bio, age
- interests (array)
- is_online, last_seen
- created_at, updated_at

#### blocked_users
Tracks blocked user relationships:
- user_id - Who blocked
- blocked_user_id - Who was blocked

#### hidden_venues
Stores hidden venue preferences:
- user_id - User who hid the venue
- venue_id - Venue identifier

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Authentication is required for all operations
- Policies enforce data privacy

## Supabase Dashboard Quick Tour

```
Supabase Dashboard (supabase.com/dashboard)
│
├── Project Overview
│   └── View project stats and API keys
│
├── Authentication
│   ├── Users → View registered users
│   ├── Policies → Configure auth settings
│   └── Providers → Enable OAuth (Google, etc.)
│
├── Table Editor
│   └── View and edit database tables
│
├── SQL Editor
│   └── Run custom SQL queries
│
└── API Docs
    └── Auto-generated API documentation
```

## Next Steps

### Enable Google Sign-In (Optional)

1. Go to Supabase Dashboard
2. Click **Authentication** → **Providers**
3. Click **Google**
4. Follow the instructions to set up Google OAuth
5. Copy the callback URL and configure in Google Cloud Console

### Add More Features

The basic structure is ready. You can now:
- Add venue management features
- Implement chat functionality
- Add photo upload with Supabase Storage
- Enable real-time updates with Supabase Realtime

## Troubleshooting

### App Won't Start

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Clear Expo cache: `npm start -- --clear`

### Authentication Errors

**Solution:**
- Verify `.env` file exists and has correct values
- Restart the development server
- Check Supabase Dashboard for authentication errors

### Database Permission Errors

**Solution:**
- Verify you're logged in
- Check that RLS policies are enabled
- Review policies in Supabase Dashboard

## Environment Variables Explained

```bash
# Supabase Project URL
# Found in: Project Settings → API → Project URL
EXPO_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co

# Supabase Anonymous Key (Public)
# Found in: Project Settings → API → Project API keys → anon public
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Expo Documentation](https://docs.expo.dev/)

## Common Commands

```bash
# Start development server
npm start

# Clear cache and start
npm start -- --clear

# Build for web
npm run build:web

# Run linter
npm run lint
```

## Getting Help

If you encounter issues:
1. Check the [DEBUG_GUIDE.md](./DEBUG_GUIDE.md)
2. Review the [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
3. Check Supabase Dashboard logs
4. Review browser/device console errors

## What's Working

- User registration with email/password
- User login and logout
- Session persistence
- Profile creation
- Privacy features (blocking users, hiding venues)

## What to Build Next

- Venue check-in system
- Real-time chat between matches
- Photo upload and gallery
- Push notifications
- Location-based matching algorithm

Happy coding!
