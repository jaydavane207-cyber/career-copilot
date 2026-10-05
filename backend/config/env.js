// backend/config/env.js
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_jwt_key_career_copilot_98765',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/career_copilot',
  DB: {
    DIALECT: process.env.DB_DIALECT || 'sqlite',
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    NAME: process.env.DB_NAME || 'career_copilot',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || 'postgres',
    SSL: process.env.DB_SSL === 'true',
    FALLBACK_SQLITE: process.env.USE_SQLITE_FALLBACK !== 'false'
  },
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  SCRAPER_TIMEOUT: parseInt(process.env.SCRAPER_TIMEOUT, 10) || 10000,
  SCRAPER_CACHE_DAYS: parseInt(process.env.SCRAPER_CACHE_DAYS, 10) || 1
};
