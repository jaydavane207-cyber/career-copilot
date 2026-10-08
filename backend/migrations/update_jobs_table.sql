-- backend/migrations/update_jobs_table.sql
-- Real Job Postings Integration Schema Migration

ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS job_description TEXT,
ADD COLUMN IF NOT EXISTS job_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS job_posting_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS job_scraped_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS match_score INTEGER,
ADD COLUMN IF NOT EXISTS required_skills TEXT[],
ADD COLUMN IF NOT EXISTS missing_skills TEXT[],
ADD COLUMN IF NOT EXISTS critical_skills JSONB,
ADD COLUMN IF NOT EXISTS job_analysis JSONB,
ADD COLUMN IF NOT EXISTS user_match_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS prep_time_estimate INTEGER,
ADD COLUMN IF NOT EXISTS prep_recommendations JSONB,
ADD COLUMN IF NOT EXISTS red_flags TEXT[],
ADD COLUMN IF NOT EXISTS auto_saved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS scraped_successfully BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_job_posting_url ON jobs(job_posting_url);
CREATE INDEX IF NOT EXISTS idx_match_score ON jobs(match_score);
CREATE INDEX IF NOT EXISTS idx_job_source ON jobs(job_source);
