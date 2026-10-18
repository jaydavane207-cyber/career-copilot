-- backend/scripts/initInterviewSchema.sql
-- Dedicated Interviews Schema for Career Copilot

-- 1. Main interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  company_name VARCHAR(255) NOT NULL,
  role_title VARCHAR(255) NOT NULL,
  stage VARCHAR(50) DEFAULT 'Round 1',               -- e.g. 'Screen', 'Round 1', 'Round 2', 'System Design', 'Behavioral', 'Final', 'HR'
  interview_type VARCHAR(50) DEFAULT 'technical',    -- 'technical', 'system_design', 'behavioral', 'hr'
  mode VARCHAR(50) DEFAULT 'online',                 -- 'online', 'onsite', 'phone'
  location VARCHAR(255),                             -- For onsite or time zone
  interview_datetime TIMESTAMP NOT NULL,             -- Exact date/time
  duration_minutes INTEGER DEFAULT 60,
  meet_link VARCHAR(500),
  status VARCHAR(50) DEFAULT 'upcoming',             -- 'upcoming', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index on (user_id, interview_datetime) for high-performance timeline queries
CREATE INDEX IF NOT EXISTS idx_interviews_user_date ON interviews(user_id, interview_datetime);

-- 2. Interview Prep Logs table
CREATE TABLE IF NOT EXISTS interview_prep_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interview_id INTEGER NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL,                    -- 'mock_interview', 'prep_material', 'behavioral_practice', 'coding', 'company_research', 'logistics'
  description TEXT,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_prep_logs_interview ON interview_prep_logs(interview_id);
