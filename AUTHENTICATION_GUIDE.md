# Authentication Implementation Guide

## Overview

This app uses **Supabase Authentication** with two sign-in methods:
1. **Email/Password** - Traditional authentication
2. **Google Sign-In** - OAuth via Expo AuthSession

All user data is stored in **Supabase PostgreSQL database**.

## File Structure

```
project/
├── config/
│   └── supabase.ts                  # Supabase initialization
├── services/
│   ├── supabaseDatabaseService.ts   # Database CRUD operations
│   └── supabaseAuthService.ts       # Authentication handler
├── app/
│   ├── _layout.tsx                  # Auth state management
│   ├── auth/
│   │   ├── login.tsx                # Login screen
│   │   └── signup.tsx               # Signup screen
│   └── (tabs)/
│       └── profile.tsx              # Profile with logout
└── .env                             # Environment variables
```

## Key Features

### ✅ Authentication Methods
- Email/password registration and login
- Google Sign-In with OAuth 2.0
- Automatic session persistence
- Secure logout with database update

### ✅ User Data Management
- Automatic profile creation in database
- First-time login: Creates new profile record
- Subsequent logins: Updates `last_seen` timestamp
- Logout: Updates `is_online` and `last_seen` fields

### ✅ Security
- Supabase handles password security
- Row Level Security (RLS) policies restrict data access
- Client-side form validation
- Error handling for all auth operations

## How It Works

### 1. Authentication Flow

```
User opens app
    ↓
Check auth state (onAuthStateChange)
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
Create/Update profile in database
      ↓
  Navigate to Home
```

### 2. Login Process

**Email/Password Login:**
```javascript
// 1. User enters email and password
// 2. Call Supabase signInWithPassword()
// 3. On success, profile is automatically linked
// 4. Navigate to home screen
```

**Google Sign-In:**
```javascript
// 1. User clicks "Sign in with Google"
// 2. Expo AuthSession opens Google OAuth flow
// 3. User authorizes in browser
// 4. Receive authorization code from Google
// 5. Exchange for Supabase session
// 6. Create/update profile in database
// 7. Navigate to home screen
```

### 3. Signup Process

```javascript
// 1. User fills registration form
// 2. Validate input (email format, password strength, etc.)
// 3. Call Supabase signUp()
// 4. Create profile in database with user data
// 5. Navigate to home screen
```

### 4. Logout Process

```javascript
// 1. User clicks logout button
// 2. Show confirmation dialog
// 3. Update database: is_online = false, last_seen = now
// 4. Call Supabase signOut()
// 5. Navigate to login screen
```

## Code Examples

### Initialize Supabase

```typescript
// config/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
```

### Check Auth State

```typescript
// app/_layout.tsx
import { supabaseAuthService } from '@/services/supabaseAuthService';

useEffect(() => {
  supabaseAuthService.getSession().then((session) => {
    setUser(session?.user ?? null);
    setIsLoading(false);
  });

  const subscription = supabaseAuthService.onAuthStateChange((user) => {
    setUser(user);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Email/Password Login

```typescript
// app/auth/login.tsx
import { supabaseAuthService } from '@/services/supabaseAuthService';

const handleLogin = async () => {
  const result = await supabaseAuthService.signIn(
    formData.email,
    formData.password
  );

  if (result.success) {
    Alert.alert('Success', 'Welcome back!');
    router.replace('/(tabs)');
  } else {
    Alert.alert('Login Failed', result.error);
  }
};
```

### Google Sign-In

```typescript
// app/auth/login.tsx
import { supabaseAuthService } from '@/services/supabaseAuthService';

const handleGoogleSignIn = async () => {
  const result = await supabaseAuthService.signInWithGoogle();

  if (result.success) {
    Alert.alert('Success', 'Welcome!');
    router.replace('/(tabs)');
  } else {
    Alert.alert('Sign In Failed', result.error);
  }
};
```

### Create User Profile

```typescript
// services/supabaseAuthService.ts
private async createUserProfile(
  userId: string,
  email: string,
  metadata?: {
    full_name?: string;
    phone?: string;
    photo_url?: string;
  }
): Promise<void> {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: email,
      full_name: metadata?.full_name || '',
      display_name: metadata?.full_name || '',
      phone: metadata?.phone || '',
      photo_url: metadata?.photo_url || '',
      photos: metadata?.photo_url ? [metadata.photo_url] : [],
      is_online: true,
      last_seen: new Date().toISOString(),
    },
    {
      onConflict: 'id',
    }
  );

  if (error) throw error;
}
```

### Logout

```typescript
// app/(tabs)/profile.tsx
import { supabaseAuthService } from '@/services/supabaseAuthService';

const handleLogout = async () => {
  const result = await supabaseAuthService.signOut();

  if (result.success) {
    router.replace('/auth/login');
  } else {
    Alert.alert('Error', result.error);
  }
};
```

## Environment Variables

Required variables in `.env`:

```bash
# Supabase Config (from Supabase Dashboard)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Tables

### `profiles` Table

Linked to `auth.users` via foreign key

```sql
{
  id: uuid,                    -- Links to auth.users(id)
  email: text,                 -- User email
  full_name: text,             -- Full name
  display_name: text,          -- Display name
  phone: text,                 -- Phone number
  photo_url: text,             -- Profile photo URL
  bio: text,                   -- User bio
  age: integer,                -- User age
  interests: text[],           -- Array of interests
  photos: text[],              -- Array of photo URLs
  is_online: boolean,          -- Online status
  last_seen: timestamptz,      -- Last activity timestamp
  created_at: timestamptz,     -- Account creation
  updated_at: timestamptz      -- Last update
}
```

### Other Tables

- `blocked_users` - Blocked user relationships
- `hidden_venues` - Hidden venue preferences
- More to be added for matches, messages, etc.

## Row Level Security (RLS)

### Profile Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can view other profiles
CREATE POLICY "Users can view other profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

## Error Handling

Common Supabase auth errors:

| Error Message | Meaning | User Message |
|--------------|---------|--------------|
| `user already registered` | Email in use | "An account with this email already exists" |
| `invalid login credentials` | Wrong email/password | "Invalid email or password" |
| `email not confirmed` | Email not verified | "Please verify your email address" |
| `invalid email` | Bad email format | "Invalid email address" |
| `password` errors | Weak password | "Password must be at least 6 characters" |

## Testing

### Test Email/Password Auth
1. Go to signup screen
2. Fill in the form
3. Click "Create Account"
4. Check Supabase Dashboard → Authentication → Users
5. Check Table Editor → profiles for new profile
6. Logout and login again
7. Verify `last_seen` is updated

### Test Google Sign-In
1. Go to login screen
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Check Supabase Dashboard for user
5. Verify profile photo and name are saved

### Test Logout
1. Click logout from profile
2. Verify confirmation dialog appears
3. Confirm logout
4. Check database: `is_online` should be `false`
5. Verify redirect to login screen

## Troubleshooting

### Google Sign-In fails
- Configure Google OAuth in Supabase Dashboard
- Go to Authentication → Providers → Google
- Add Google Client ID and Secret
- Restart Expo dev server

### Database permission denied
- Check RLS policies in Supabase Dashboard
- Verify user is authenticated
- Ensure user is accessing their own data
- Review Supabase logs for detailed errors

### User not navigating after login
- Check auth state listener in `_layout.tsx`
- Verify profile creation completes successfully
- Check for JavaScript errors in console
- Ensure environment variables are loaded

### Session not persisting
- Verify AsyncStorage is installed
- Check that `persistSession: true` in config
- Clear app data and try again

## Production Checklist

Before deploying:

- [ ] Review Row Level Security policies
- [ ] Configure OAuth providers in Supabase Dashboard
- [ ] Set up custom domain (optional)
- [ ] Enable email verification (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test on real devices
- [ ] Add loading states for better UX
- [ ] Implement password reset flow
- [ ] Configure rate limiting

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Expo AuthSession Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

## Summary

Authentication in this app:
- Uses Supabase for secure authentication
- Supports email/password and Google OAuth
- Sessions stored in AsyncStorage
- Auto-refreshing tokens
- Row Level Security protects user data
- Profiles automatically created on signup

For implementation details, see:
- `config/supabase.ts`
- `services/supabaseAuthService.ts`
- `app/_layout.tsx`
- `app/auth/login.tsx`
- `app/auth/signup.tsx`
