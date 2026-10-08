-- backend/migrations/create_stories_leaderboards_tables.sql
-- Career Copilot: Feature 7 - Success Stories & Leaderboard Schema

-- 1. Success Stories Table
CREATE TABLE IF NOT EXISTS success_stories (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  company_name VARCHAR(255) DEFAULT 'Tech Company',
  role VARCHAR(255) NOT NULL DEFAULT 'Software Engineer',
  experience_level VARCHAR(50) DEFAULT 'Mid',
  years_experience INTEGER DEFAULT 2,
  starting_salary INTEGER DEFAULT 150000,
  final_salary INTEGER DEFAULT 180000,
  negotiation_amount INTEGER DEFAULT 30000,
  salary_percentage_increase FLOAT DEFAULT 20.0,
  job_type VARCHAR(50) DEFAULT 'Full-time',
  location VARCHAR(255) DEFAULT 'Mountain View, CA',
  interview_duration INTEGER DEFAULT 21,
  preparation_weeks INTEGER DEFAULT 4,
  interviews_completed INTEGER DEFAULT 4,
  mock_interviews_done INTEGER DEFAULT 10,
  coding_problems_logged INTEGER DEFAULT 100,
  study_plan_followed BOOLEAN DEFAULT true,
  key_preparation JSONB DEFAULT '[]'::jsonb,
  story_title VARCHAR(500) NOT NULL,
  story_text TEXT NOT NULL,
  key_tips JSONB DEFAULT '[]'::jsonb,
  what_helped_most VARCHAR(500),
  what_hindered VARCHAR(500),
  advice_for_others TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  is_anonymous BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  rating INTEGER DEFAULT 5,
  helpful_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_success_stories_user ON success_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_company ON success_stories(company_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_role ON success_stories(role);
CREATE INDEX IF NOT EXISTS idx_success_stories_status ON success_stories(status);

-- 2. Story Comments Table
CREATE TABLE IF NOT EXISTS story_comments (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES success_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_story_comments_story ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_user ON story_comments(user_id);

-- 3. Story Upvotes Table
CREATE TABLE IF NOT EXISTS story_upvotes (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES success_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_story_user_upvote UNIQUE (story_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_story_upvotes ON story_upvotes(story_id, user_id);

-- 4. Leaderboard Entries Table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  avatar VARCHAR(500),
  company VARCHAR(255) DEFAULT 'Tech Company',
  role VARCHAR(255) DEFAULT 'Software Engineer',
  rank_type VARCHAR(50) NOT NULL DEFAULT 'salary',
  period VARCHAR(50) DEFAULT 'all_time',
  rank INTEGER NOT NULL DEFAULT 1,
  rank_value VARCHAR(100) NOT NULL DEFAULT '0',
  rank_change VARCHAR(50) DEFAULT '→ 0',
  badges JSONB DEFAULT '[]'::jsonb,
  points INTEGER DEFAULT 500,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_type_period ON leaderboard_entries(rank_type, period, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_entries(user_id);

-- 5. User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(100) NOT NULL,
  badge_name VARCHAR(255) NOT NULL,
  badge_description TEXT,
  rarity VARCHAR(50) DEFAULT 'Common',
  points INTEGER DEFAULT 100,
  earned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_badge UNIQUE (user_id, badge_type)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

-- 6. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  progress_current INTEGER DEFAULT 0,
  progress_target INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'in_progress',
  earned_date TIMESTAMP WITH TIME ZONE,
  points INTEGER DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_type)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- 7. Story Reports Table (for Moderation)
CREATE TABLE IF NOT EXISTS story_reports (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES success_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_story_reports_story ON story_reports(story_id);
