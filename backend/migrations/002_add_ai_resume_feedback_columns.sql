-- Migration: 002_add_ai_resume_feedback_columns.sql
-- Adds AI feedback, improved resume, and scoring columns to resumes table

ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS ai_feedback JSONB,
ADD COLUMN IF NOT EXISTS ai_improved_resume TEXT,
ADD COLUMN IF NOT EXISTS ai_score INTEGER,
ADD COLUMN IF NOT EXISTS ai_feedback_generated_at TIMESTAMP WITH TIME ZONE;

-- If a separate resume_analyses table is used:
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'resume_analyses') THEN
        ALTER TABLE resume_analyses
        ADD COLUMN IF NOT EXISTS ai_feedback JSONB,
        ADD COLUMN IF NOT EXISTS ai_improved_resume TEXT,
        ADD COLUMN IF NOT EXISTS ai_score INTEGER,
        ADD COLUMN IF NOT EXISTS ai_feedback_generated_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;
