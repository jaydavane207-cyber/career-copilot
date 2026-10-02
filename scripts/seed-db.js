// scripts/seed-db.js
// Master seeding runner for Career Copilot

const path = require('path');

console.log('🌱 Starting Career Copilot Database Seeder...');

try {
  const seedScript = require(path.join(__dirname, '..', 'backend', 'seeds', 'seed.js'));
  if (typeof seedScript === 'function') {
    seedScript();
  }
} catch (error) {
  console.error('❌ Failed to run seed script:', error.message);
  process.exit(1);
}
