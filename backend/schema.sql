-- Career Copilot - PostgreSQL Database Schema
-- Run this script in PostgreSQL (psql -U postgres -d career_copilot -f schema.sql)

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "targetRole" VARCHAR(255) DEFAULT 'Full Stack Developer',
    "experienceLevel" VARCHAR(100) DEFAULT 'Entry-Level',
    bio TEXT,
    "avatarUrl" VARCHAR(500),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on targetRole for candidate filtering and analytics
CREATE INDEX IF NOT EXISTS idx_users_target_role ON users("targetRole");

-- Jobs Table (Job Application Tracker)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "companyName" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255) NOT NULL,
    "jobLink" VARCHAR(500),
    "stage" VARCHAR(50) DEFAULT 'applied' CHECK ("stage" IN ('applied', 'interview', 'offer')),
    "dateApplied" DATE DEFAULT CURRENT_DATE,
    "interviewDate" DATE,
    "notes" TEXT,
    "salary" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs("userId");
CREATE INDEX IF NOT EXISTS idx_jobs_stage ON jobs("stage");
