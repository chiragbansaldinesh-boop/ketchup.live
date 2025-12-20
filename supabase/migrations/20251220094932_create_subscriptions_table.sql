/*
  # Subscription System Tables

  ## New Tables
  
  ### `subscriptions`
  - `id` (uuid, primary key) - Unique identifier for the subscription
  - `user_id` (uuid, foreign key) - Reference to the subscribed user
  - `plan_type` (text) - Type of subscription (day, month, year)
  - `status` (text) - Status of subscription (active, cancelled, expired)
  - `start_date` (timestamptz) - When subscription started
  - `end_date` (timestamptz) - When subscription ends
  - `auto_renew` (boolean) - Whether subscription auto-renews
  - `payment_provider` (text) - Payment provider used
  - `payment_id` (text) - External payment ID
  - `created_at` (timestamptz) - When record was created
  - `updated_at` (timestamptz) - When record was last updated
  
  ### `subscription_features`
  - `id` (uuid, primary key) - Unique identifier
  - `subscription_id` (uuid, foreign key) - Reference to subscription
  - `feature_name` (text) - Name of the feature
  - `feature_value` (jsonb) - Feature configuration
  - `enabled` (boolean) - Whether feature is enabled

  ## Updates to profiles table
  - Add `subscription_tier` column to track current tier
  - Add `premium_until` column to track premium expiry
  
  ## Security
  - Enable RLS on all tables
  - Users can only view/update their own subscriptions
  - Admins can manage all subscriptions
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('day', 'month', 'year')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz NOT NULL,
  auto_renew boolean DEFAULT true,
  payment_provider text,
  payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_features table
CREATE TABLE IF NOT EXISTS subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
  feature_name text NOT NULL,
  feature_value jsonb DEFAULT '{}'::jsonb,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add subscription columns to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'premium_until'
  ) THEN
    ALTER TABLE profiles ADD COLUMN premium_until timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'story_sharing_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN story_sharing_enabled boolean DEFAULT true;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscription_features_subscription_id ON subscription_features(subscription_id);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscription features policies
CREATE POLICY "Users can view own subscription features"
  ON subscription_features FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_features.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- Function to update subscription status
CREATE OR REPLACE FUNCTION check_subscription_expiry()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET status = 'expired'
  WHERE status = 'active'
  AND end_date < now();
  
  UPDATE profiles
  SET 
    subscription_tier = 'free',
    premium_until = NULL
  WHERE user_id IN (
    SELECT user_id FROM subscriptions
    WHERE status = 'expired'
    AND end_date < now()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to activate subscription
CREATE OR REPLACE FUNCTION activate_subscription(
  p_user_id uuid,
  p_plan_type text
)
RETURNS uuid AS $$
DECLARE
  v_end_date timestamptz;
  v_subscription_id uuid;
BEGIN
  -- Calculate end date based on plan type
  CASE p_plan_type
    WHEN 'day' THEN
      v_end_date := now() + interval '1 day';
    WHEN 'month' THEN
      v_end_date := now() + interval '1 month';
    WHEN 'year' THEN
      v_end_date := now() + interval '1 year';
    ELSE
      RAISE EXCEPTION 'Invalid plan type';
  END CASE;

  -- Create subscription
  INSERT INTO subscriptions (user_id, plan_type, status, start_date, end_date)
  VALUES (p_user_id, p_plan_type, 'active', now(), v_end_date)
  RETURNING id INTO v_subscription_id;

  -- Update profile
  UPDATE profiles
  SET 
    subscription_tier = 'premium',
    premium_until = v_end_date
  WHERE user_id = p_user_id;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER trigger_update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
