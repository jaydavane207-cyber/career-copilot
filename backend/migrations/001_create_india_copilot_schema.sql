-- ============================================================================
-- Career Copilot - India-Specific Schema Migration (001)
-- PostgreSQL / Standard SQL compatible DDL
-- 
-- Tables Created:
-- 1. roles - Target tech careers in India with compensation and location benchmarks
-- 2. skills - Role skills curriculum (with role_id foreign key) & user assessed skills
-- 3. mock_interview_questions - 100 questions (Behavioral, Technical, System Design)
-- 4. resources - 100+ curated resources mapped by skill
-- 5. popular_companies - Top Indian tech firms and MNCs with interview tips
-- 6. coding_topics - DSA problem topics frequently asked in Indian tech rounds
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ROLES TABLE
-- Stores target tech roles with India market metadata, salary LPA bands,
-- popular hiring tech hubs, and core/optional skill tags.
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
-- 2. SKILLS TABLE (with role_id foreign key)
-- Bridges role curriculum requirements (role_id != NULL) and user skill assessments (userId != NULL).
-- Holds benchmark proficiency (requiredLevel), estimated learning hours, difficulty,
-- and categorized resources.
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
-- 3. MOCK INTERVIEW QUESTIONS TABLE
-- 100 questions covering:
-- - 35 Behavioral (STAR framework, team conflict, failure recovery, leadership)
-- - 40 Technical (Frontend, SDE/Backend, QA Automation, Data Science)
-- - 25 System Design (High-concurrency systems, Indian tech unicorn scenarios)
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
-- 4. RESOURCES TABLE
-- 100+ curated learning materials mapped by skill with direct links,
-- providers (MDN, FreeCodeCamp, Striver, ByteByteGo), and types.
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
-- 5. POPULAR COMPANIES TABLE
-- Company profiles across Tier-1 Product, Fintech Unicorns, E-commerce,
-- and IT Services firms hiring across India with compensation bands and tips.
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
-- 6. CODING TOPICS TABLE
-- Algorithmic topics tested in Indian tech interviews (Arrays, Trees, DP, etc.)
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
