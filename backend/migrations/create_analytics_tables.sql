-- backend/migrations/create_analytics_tables.sql
-- Career Copilot: Feature 8 - Career Analytics Dashboard Schema

-- 1. Application Analytics Table
CREATE TABLE IF NOT EXISTS application_analytics (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_applications INTEGER DEFAULT 0,
  applications_by_stage JSONB DEFAULT '{"applied": 0, "phone_screen": 0, "technical": 0, "offer": 0}'::jsonb,
  conversion_rates JSONB DEFAULT '{"phone_screen": 0, "technical": 0, "offer": 0}'::jsonb,
  interview_success_rate DECIMAL(5, 2) DEFAULT 0.0,
  days_to_first_interview INTEGER DEFAULT 0,
  days_to_offer INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_application_analytics_user ON application_analytics(user_id);

-- 2. Skill Performance Analytics Table
CREATE TABLE IF NOT EXISTS skill_performance_analytics (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  practice_count INTEGER DEFAULT 0,
  practice_hours INTEGER DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0.0,
  avg_score DECIMAL(5, 2) DEFAULT 0.0,
  platform_avg_success_rate DECIMAL(5, 2) DEFAULT 75.0,
  vs_platform_avg DECIMAL(5, 2) DEFAULT 0.0,
  trend VARCHAR(50) DEFAULT 'stable',
  related_salary_increase INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_performance_user ON skill_performance_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_performance_skill ON skill_performance_analytics(skill_name);

-- 3. Salary Analytics Table
CREATE TABLE IF NOT EXISTS salary_analytics (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255) DEFAULT 'Full Stack Developer',
  location VARCHAR(255) DEFAULT 'Remote / US',
  starting_offers JSONB DEFAULT '[]'::jsonb,
  negotiated_offers JSONB DEFAULT '[]'::jsonb,
  total_negotiated INTEGER DEFAULT 0,
  avg_salary_start INTEGER DEFAULT 0,
  avg_salary_final INTEGER DEFAULT 0,
  avg_negotiation_amount INTEGER DEFAULT 0,
  avg_negotiation_percentage DECIMAL(5, 2) DEFAULT 0.0,
  platform_avg_salary INTEGER DEFAULT 175000,
  platform_percentile INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_salary_analytics_user ON salary_analytics(user_id);

-- 4. Study Effectiveness Analytics Table
CREATE TABLE IF NOT EXISTS study_effectiveness_analytics (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  study_hours_logged INTEGER DEFAULT 0,
  topics_studied JSONB DEFAULT '[]'::jsonb,
  skill_improvement_score DECIMAL(5, 2) DEFAULT 0.0,
  time_to_readiness INTEGER DEFAULT 30,
  interview_prep_score DECIMAL(5, 2) DEFAULT 0.0,
  mock_interview_improvement DECIMAL(5, 2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_study_effectiveness_user ON study_effectiveness_analytics(user_id);

-- 5. Preparation ROI Analytics Table
CREATE TABLE IF NOT EXISTS preparation_roi_analytics (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  hours_spent INTEGER DEFAULT 0,
  interviews_using_skill INTEGER DEFAULT 0,
  interview_success_with_skill DECIMAL(5, 2) DEFAULT 0.0,
  interview_success_without_skill DECIMAL(5, 2) DEFAULT 0.0,
  success_improvement DECIMAL(5, 2) DEFAULT 0.0,
  estimated_salary_impact INTEGER DEFAULT 0,
  roi_per_hour DECIMAL(10, 2) DEFAULT 0.0,
  is_critical_skill BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prep_roi_user ON preparation_roi_analytics(user_id);

-- 6. Platform Analytics Table
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY,
  metric_type VARCHAR(100) NOT NULL,
  metric_value VARCHAR(255) NOT NULL,
  sample_size INTEGER DEFAULT 1000,
  time_period VARCHAR(50) DEFAULT 'all_time',
  role VARCHAR(255),
  location VARCHAR(255),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_analytics_metric ON platform_analytics(metric_type);

-- 7. User Comparisons Table
CREATE TABLE IF NOT EXISTS user_comparisons (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comparison_metric VARCHAR(100) NOT NULL,
  user_value DECIMAL(10, 2) DEFAULT 0.0,
  platform_avg DECIMAL(10, 2) DEFAULT 0.0,
  percentile INTEGER DEFAULT 50,
  rank_position INTEGER DEFAULT 1,
  total_users_in_group INTEGER DEFAULT 1000,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_comparisons_user ON user_comparisons(user_id);
