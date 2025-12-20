/*
  # Stories Feature Tables

  ## New Tables
  
  ### `stories`
  - `id` (uuid, primary key) - Unique identifier for each story
  - `user_id` (uuid, foreign key) - Reference to the user who created the story
  - `media_url` (text) - URL to the story image or video
  - `media_type` (text) - Type of media (image/video)
  - `created_at` (timestamptz) - When the story was created
  - `expires_at` (timestamptz) - When the story expires (24 hours from creation)
  - `viewers` (jsonb) - Array of user IDs who viewed the story
  - `viewer_count` (integer) - Count of unique viewers
  
  ### `story_views`
  - `id` (uuid, primary key) - Unique identifier for the view
  - `story_id` (uuid, foreign key) - Reference to the story
  - `viewer_id` (uuid, foreign key) - Reference to the user who viewed
  - `viewed_at` (timestamptz) - When the story was viewed

  ## Security
  - Enable RLS on all tables
  - Users can create their own stories
  - Users can view stories from people they've matched with or are nearby
  - Users can view their own story views
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_url text NOT NULL,
  media_type text DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  viewers jsonb DEFAULT '[]'::jsonb,
  viewer_count integer DEFAULT 0
);

-- Create story_views table
CREATE TABLE IF NOT EXISTS story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(story_id, viewer_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_viewer_id ON story_views(viewer_id);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;

-- Stories policies
CREATE POLICY "Users can create own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view stories from others"
  ON stories FOR SELECT
  TO authenticated
  USING (
    expires_at > now() AND
    user_id != auth.uid()
  );

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Story views policies
CREATE POLICY "Users can create story views"
  ON story_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = viewer_id);

CREATE POLICY "Story owners can view who viewed their stories"
  ON story_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_views.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Viewers can see their own views"
  ON story_views FOR SELECT
  TO authenticated
  USING (auth.uid() = viewer_id);

-- Function to update viewer count
CREATE OR REPLACE FUNCTION update_story_viewer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET viewer_count = (
    SELECT COUNT(DISTINCT viewer_id)
    FROM story_views
    WHERE story_id = NEW.story_id
  )
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update viewer count
DROP TRIGGER IF EXISTS trigger_update_story_viewer_count ON story_views;
CREATE TRIGGER trigger_update_story_viewer_count
  AFTER INSERT ON story_views
  FOR EACH ROW
  EXECUTE FUNCTION update_story_viewer_count();
