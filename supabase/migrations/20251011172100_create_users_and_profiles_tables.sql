/*
  # Create Users and Profiles Schema for Ketchup.live

  ## Overview
  This migration creates the core user authentication and profile management tables
  for the Ketchup.live social networking application.

  ## New Tables

  ### `profiles`
  Stores extended user profile information linked to Supabase auth.users
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text, unique, not null) - User's email address
  - `full_name` (text) - User's full name
  - `display_name` (text) - User's display name
  - `phone` (text) - User's phone number
  - `photo_url` (text) - URL to profile picture
  - `bio` (text) - User biography
  - `age` (integer) - User's age
  - `interests` (text[]) - Array of user interests
  - `photos` (text[]) - Array of photo URLs
  - `is_online` (boolean, default false) - Online status
  - `last_seen` (timestamptz) - Last seen timestamp
  - `created_at` (timestamptz, default now()) - Account creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ### `blocked_users`
  Tracks blocked user relationships for privacy and safety
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, not null) - User who blocked
  - `blocked_user_id` (uuid, not null) - User who was blocked
  - `created_at` (timestamptz, default now()) - Block timestamp

  ### `hidden_venues`
  Stores venues that users have hidden from their discovery feed
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, not null) - User who hid the venue
  - `venue_id` (text, not null) - Identifier of the hidden venue
  - `created_at` (timestamptz, default now()) - Hide timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only read their own profile data
  - Users can only update their own profile
  - Users can manage their own blocked users and hidden venues
  - Authenticated access required for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  display_name text,
  phone text,
  photo_url text,
  bio text DEFAULT '',
  age integer,
  interests text[] DEFAULT '{}',
  photos text[] DEFAULT '{}',
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, blocked_user_id)
);

-- Create hidden_venues table
CREATE TABLE IF NOT EXISTS hidden_venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_online ON profiles(is_online);
CREATE INDEX IF NOT EXISTS idx_blocked_users_user_id ON blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked_user_id ON blocked_users(blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_hidden_venues_user_id ON hidden_venues(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hidden_venues ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view other profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Blocked users policies
CREATE POLICY "Users can view their own blocked users"
  ON blocked_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can block other users"
  ON blocked_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unblock users"
  ON blocked_users FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Hidden venues policies
CREATE POLICY "Users can view their hidden venues"
  ON hidden_venues FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can hide venues"
  ON hidden_venues FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unhide venues"
  ON hidden_venues FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
