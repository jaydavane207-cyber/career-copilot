-- Migration: Create oauth_profiles table
-- Career Copilot: Feature 3 - LinkedIn/GitHub Integration

CREATE TABLE IF NOT EXISTS oauth_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(100),
  provider_username VARCHAR(100),
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  profile_data JSONB DEFAULT '{}',
  imported_work_experience JSONB DEFAULT '[]',
  imported_education JSONB DEFAULT '[]',
  imported_skills JSONB DEFAULT '[]',
  imported_repositories JSONB DEFAULT '[]',
  last_refreshed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_oauth_user_provider UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_oauth_user_provider ON oauth_profiles(user_id, provider);
