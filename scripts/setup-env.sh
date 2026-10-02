#!/usr/bin/env bash
# Career Copilot - Environment Setup Script

echo "🚀 Setting up Career Copilot environment..."

# 1. Backend environment
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
else
    echo "backend/.env already exists."
fi

# 2. Frontend environment
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local from template..."
    cp frontend/.env.example frontend/.env.local
else
    echo "frontend/.env.local already exists."
fi

# 3. Create uploads folder
mkdir -p backend/uploads

echo "✅ Environment configured successfully!"
