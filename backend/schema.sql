-- Career Copilot - PostgreSQL Database Schema
-- Run this script in PostgreSQL (psql -U postgres -d career_copilot -f schema.sql)

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
-- Schema matches backend requirements:
-- id (UUID primary key), email (unique), password (hashed), name, targetRole, createdAt, updatedAt
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
