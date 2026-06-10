-- ScoutAI Alerts Database Schema
-- Run these queries in Supabase SQL Editor

-- ─── Users Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  teams JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ─── Notifications Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pre-match', 'live', 'ended')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create composite index to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_unique 
  ON notifications(user_id, match_id, type);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Create index for faster lookups by match
CREATE INDEX IF NOT EXISTS idx_notifications_match_id ON notifications(match_id);

-- ─── Enable Row Level Security (RLS) ──────────────────────────────────────
-- Note: For production, configure RLS policies to restrict access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ─── Sample Data (Optional) ────────────────────────────────────────────────
-- INSERT INTO users (email, teams) 
-- VALUES (
--   'user@example.com',
--   '[{"name": "Brazil", "flag": "🇧🇷", "code": "BRA"}, {"name": "Germany", "flag": "🇩🇪", "code": "GER"}]'::jsonb
-- );
