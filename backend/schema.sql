-- ============================================================================
-- Career Copilot - Complete Database Schema (PostgreSQL DDL)
-- Run this script in PostgreSQL:
-- psql -U postgres -d career_copilot -f schema.sql
-- ============================================================================

-- Enable UUID extension for unique primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- Core authentication and candidate profiles with target career role
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "targetRole" VARCHAR(255) DEFAULT 'Full Stack Developer',
    "experienceLevel" VARCHAR(100) DEFAULT 'Entry-Level',
    bio TEXT,
    "avatarUrl" VARCHAR(500),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_target_role ON users("targetRole");

-- ============================================================================
-- 2. ROLES TABLE (20 Popular India Tech Jobs)
-- Pre-loaded tech career benchmarks calibrated for the Indian job ecosystem
-- Includes typical compensation in LPA (Lakhs Per Annum) and tech hubs.
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Software Engineering',
    description TEXT NOT NULL,
    "experienceLevel" VARCHAR(100) DEFAULT 'Mid-Level',
    "salaryRangeInr" VARCHAR(100) DEFAULT '₹12 LPA - ₹25 LPA',
    "popularLocations" JSONB DEFAULT '["Bengaluru", "Hyderabad", "Pune", "Gurugram", "Noida"]'::jsonb,
    "marketDemand" VARCHAR(50) DEFAULT 'High',
    "coreSkills" JSONB DEFAULT '[]'::jsonb,
    "optionalSkills" JSONB DEFAULT '[]'::jsonb,
    "topHiringCompanies" JSONB DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roles_category ON roles(category);
CREATE INDEX IF NOT EXISTS idx_roles_experience ON roles("experienceLevel");

-- ============================================================================
-- 3. SKILLS TABLE (with role_id foreign key)
-- Stores role skill requirements (role_id != NULL) and user skills (userId != NULL).
-- Defines difficulty, requiredLevel (0-100), estimated study hours, and resource links.
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id VARCHAR(100) REFERENCES roles(id) ON DELETE CASCADE,
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "skillName" VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    "requiredLevel" INTEGER DEFAULT 75,
    "estimatedHours" INTEGER DEFAULT 60,
    "isOptional" BOOLEAN DEFAULT FALSE,
    resources JSONB DEFAULT '{}'::jsonb,
    proficiency VARCHAR(50) DEFAULT 'Intermediate',
    "yearsOfExperience" REAL DEFAULT 1.0,
    "isVerified" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skills_role_id ON skills(role_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills("userId");
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills("skillName");

-- ============================================================================
-- 4. MOCK INTERVIEW QUESTIONS TABLE (100 Curated Questions)
-- Partitioned into:
-- - 35 Behavioral (STAR narrative, conflict, failure recovery)
-- - 40 Technical (Frontend, SDE/Backend, QA Automation, Data Science)
-- - 25 System Design (Scalable architectures & Indian unicorn scenarios)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mock_interview_questions (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- Behavioral, Technical, System Design
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    role VARCHAR(100) NOT NULL DEFAULT 'General',
    difficulty VARCHAR(50) DEFAULT 'Medium',
    question TEXT NOT NULL,
    "followUps" JSONB DEFAULT '[]'::jsonb,
    "sampleAnswer" JSONB NOT NULL DEFAULT '{}'::jsonb, -- { strongAnswer, keyPoints, tips }
    "expectedKeywords" JSONB DEFAULT '[]'::jsonb,
    "indiaContextTip" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mock_q_type ON mock_interview_questions(type);
CREATE INDEX IF NOT EXISTS idx_mock_q_role ON mock_interview_questions(role);
CREATE INDEX IF NOT EXISTS idx_mock_q_difficulty ON mock_interview_questions(difficulty);

-- ============================================================================
-- 5. RESOURCES TABLE (100+ Curated Learning Resources)
-- Structured learning resources mapped by technical skill
-- Includes documentation, video tutorials, GitHub repos, and courses.
-- ============================================================================
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Documentation', -- Documentation, Video, Course, GitHub Repo, Interactive
    url TEXT NOT NULL,
    free BOOLEAN DEFAULT TRUE,
    description TEXT,
    level VARCHAR(50) DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    provider VARCHAR(100) DEFAULT 'Official',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_skill ON resources(skill);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- ============================================================================
-- 6. POPULAR COMPANIES TABLE (India-Specific Insights & Tips)
-- Profiles top Tier-1 Big Tech, Indian Unicorns, GCCs, and IT Services giants
-- with real-world compensation bands in INR LPA and actionable interview tips.
-- ============================================================================
CREATE TABLE IF NOT EXISTS popular_companies (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Tier-1 Product / Big Tech',
    tier VARCHAR(50) DEFAULT 'Tier 1',
    headquarters VARCHAR(100) DEFAULT 'Bengaluru',
    "indiaOffices" JSONB DEFAULT '["Bengaluru"]'::jsonb,
    "typicalRounds" JSONB DEFAULT '[]'::jsonb,
    "focusAreas" JSONB DEFAULT '[]'::jsonb,
    "salaryRangeByLevel" JSONB DEFAULT '{}'::jsonb,
    "interviewTips" JSONB DEFAULT '[]'::jsonb,
    "popularRoles" JSONB DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_companies_tier ON popular_companies(tier);
CREATE INDEX IF NOT EXISTS idx_companies_category ON popular_companies(category);

-- ============================================================================
-- 7. CODING TOPICS TABLE
-- Algorithmic problem topics frequently asked in Indian tech rounds
-- ============================================================================
CREATE TABLE IF NOT EXISTS coding_topics (
    id VARCHAR(100) PRIMARY KEY,
    "topicName" VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "frequencyInIndiaInterviews" VARCHAR(50) DEFAULT 'High',
    "keyPatterns" JSONB DEFAULT '[]'::jsonb,
    "recommendedProblems" JSONB DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. JOBS TABLE (Job Application Tracker)
-- User job pipeline across applied, interview, and offer stages
-- ============================================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "companyName" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255) NOT NULL,
    "jobLink" VARCHAR(500),
    "stage" VARCHAR(50) DEFAULT 'applied' CHECK ("stage" IN ('applied', 'interview', 'offer', 'rejected')),
    "dateApplied" DATE DEFAULT CURRENT_DATE,
    "interviewDate" DATE,
    "notes" TEXT,
    "salary" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs("userId");
CREATE INDEX IF NOT EXISTS idx_jobs_stage ON jobs("stage");

-- ============================================================================
-- 9. RESUMES TABLE
-- Stores uploaded and parsed resume documents with keyword match analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "fileName" VARCHAR(255) NOT NULL,
    "filePath" VARCHAR(500) NOT NULL,
    "targetRole" VARCHAR(255),
    "matchScore" INTEGER DEFAULT 0,
    "missingKeywords" JSONB DEFAULT '[]'::jsonb,
    "matchingKeywords" JSONB DEFAULT '[]'::jsonb,
    "extractedText" TEXT,
    "feedback" TEXT,
    ai_feedback JSONB,
    ai_improved_resume TEXT,
    ai_score INTEGER,
    ai_feedback_generated_at TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes("userId");

-- ============================================================================
-- 10. STUDY PLANS TABLE
-- Personalized study roadmap milestones and task progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topics JSONB DEFAULT '[]'::jsonb,
    "targetDate" DATE,
    "completedHours" INTEGER DEFAULT 0,
    "totalHours" INTEGER DEFAULT 40,
    status VARCHAR(50) DEFAULT 'in-progress',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans("userId");

-- ============================================================================
-- 11. CODING PROBLEMS TABLE
-- Solved coding practice tracker with spaced repetition scheduling
-- ============================================================================
CREATE TABLE IF NOT EXISTS coding_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "problemName" VARCHAR(255) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    "timeTaken" INTEGER DEFAULT 30,
    "selfRating" INTEGER DEFAULT 3,
    solved BOOLEAN DEFAULT TRUE,
    notes TEXT,
    "nextReviewDate" TIMESTAMP WITH TIME ZONE,
    "reviewStage" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coding_problems_user_id ON coding_problems("userId");
CREATE INDEX IF NOT EXISTS idx_coding_problems_topic ON coding_problems(topic);

-- ============================================================================
-- 12. MOCK INTERVIEWS TABLE
-- Completed interview practice sessions and rubric evaluations
-- ============================================================================
CREATE TABLE IF NOT EXISTS mock_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(255) DEFAULT 'Full Stack Developer',
    "interviewType" VARCHAR(50) DEFAULT 'Technical',
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    answers JSONB DEFAULT '[]'::jsonb,
    "sessionStats" JSONB DEFAULT '{}'::jsonb,
    questions JSONB DEFAULT '[]'::jsonb,
    "overallScore" REAL DEFAULT 0.0,
    "feedbackSummary" TEXT,
    strengths JSONB DEFAULT '[]'::jsonb,
    "areasForImprovement" JSONB DEFAULT '[]'::jsonb,
    "durationMinutes" INTEGER DEFAULT 15,
    "completedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_id ON mock_interviews("userId");
