#!/usr/bin/env bash
# Career Copilot - Build and Deployment Preparation Script

set -e

echo "📦 Preparing Career Copilot for production deployment..."

# Build frontend
echo "Building frontend client assets..."
cd frontend
npm install
npm run build
cd ..

# Install backend production dependencies
echo "Verifying backend dependencies..."
cd backend
npm install --omit=dev
cd ..

echo "✅ Production build completed successfully!"
