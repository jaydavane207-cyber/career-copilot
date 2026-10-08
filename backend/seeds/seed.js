// backend/seeds/seed.js
/**
 * Master Database Seeder for Career Copilot - India Edition
 * Seeds comprehensive datasets calibrated for the Indian Tech Job Market:
 * - 20 Target Roles (Senior Software Engineer, Full Stack, SDE, DevOps, QA, Data Science, etc.)
 * - 220 Skill Definitions (8 required + 3 optional per role with proficiency benchmarks & hours)
 * - 100 Mock Interview Questions (35 Behavioral, 40 Technical, 25 System Design with complete STAR rubrics)
 * - 108+ Curated Learning Resources mapped by skill
 * - 25 Popular Tech Companies in India (Tier-1 Big Tech, Indian Unicorns, GCCs, IT Services with LPA salaries)
 * - 20 Coding Problem Topics with classic benchmark interview problems
 * - Demo User & Sample Tracked Applications
 */

const {
  sequelize,
  User,
  Job,
  CodingProblem,
  StudyPlan,
  Role,
  Skill,
  MockInterviewQuestion,
  Resource,
  PopularCompany,
  CodingTopic
} = require('../models');
const { testConnection } = require('../config/database');

// Load JSON Fixtures
const rolesData = require('./roles.json');
const skillsData = require('./skills.json');
const questionsData = require('./questions.json');
const resourcesMap = require('./resources.json');
const popularCompaniesData = require('./popularCompanies.json');
const codingTopicsData = require('./codingTopics.json');
const { seedCompanyData } = require('./seedCompanies');

/**
 * Migration helper to ensure SQLite or PostgreSQL tables have correct schema
 */
const ensureSchemaCompatibility = async () => {
  const dialect = sequelize.getDialect();
  if (dialect === 'sqlite') {
    try {
      // Check if skills table has role_id column
      const [columns] = await sequelize.query("PRAGMA table_info('skills');");
      const colNames = columns.map(c => c.name);
      
      if (!colNames.includes('role_id')) {
        console.log('🔄 Migrating SQLite skills table to include role_id and curriculum schema...');
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS skills_new (
            id TEXT PRIMARY KEY,
            role_id TEXT,
            userId TEXT,
            skillName TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            difficulty TEXT DEFAULT 'Intermediate',
            requiredLevel INTEGER DEFAULT 75,
            estimatedHours INTEGER DEFAULT 60,
            isOptional BOOLEAN DEFAULT 0,
            resources TEXT DEFAULT '{}',
            proficiency TEXT DEFAULT 'Intermediate',
            yearsOfExperience REAL DEFAULT 1.0,
            isVerified BOOLEAN DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
          );
        `);
        await sequelize.query(`
          INSERT OR IGNORE INTO skills_new (id, userId, skillName, category, proficiency, yearsOfExperience, isVerified, createdAt, updatedAt)
          SELECT id, userId, skillName, category, proficiency, yearsOfExperience, isVerified, createdAt, updatedAt FROM skills;
        `);
        await sequelize.query(`DROP TABLE skills;`);
        await sequelize.query(`ALTER TABLE skills_new RENAME TO skills;`);
        console.log('✅ SQLite skills table migration complete.');
      }
    } catch (e) {
      console.warn('⚠️ SQLite migration check note:', e.message);
    }
  }
};

const runSeeder = async () => {
  try {
    console.log('🌱 [Career Copilot] Testing database connection...');
    await testConnection();

    console.log('🔧 [Career Copilot] Verifying schema compatibility...');
    await ensureSchemaCompatibility();

    console.log('🔄 [Career Copilot] Synchronizing models with database...');
    await sequelize.sync();

    // ========================================================================
    // 1. Seed Roles (20 Target Roles)
    // ========================================================================
    console.log(`💼 Seeding ${rolesData.length} target tech roles...`);
    await Role.destroy({ where: {} });
    for (const r of rolesData) {
      await Role.upsert({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        experienceLevel: r.experienceLevel,
        salaryRangeInr: r.salaryRangeInr,
        popularLocations: r.popularLocations,
        marketDemand: r.marketDemand,
        coreSkills: r.coreSkills,
        optionalSkills: r.optionalSkills,
        topHiringCompanies: r.topHiringCompanies
      });
    }
    console.log(`✅ Seeded ${rolesData.length} roles into 'roles' table.`);

    // ========================================================================
    // 2. Seed Skills (Role-specific benchmark skills with role_id foreign key)
    // ========================================================================
    console.log(`🛠️ Seeding role skills benchmarks...`);
    // Remove existing role benchmark skills (where userId is null) to reseed cleanly
    await Skill.destroy({ where: { userId: null } });

    const skillRecords = skillsData.map(s => ({
      roleId: s.roleId,
      userId: null, // role definition skill
      skillName: s.skill || s.skillName,
      category: s.category || 'General',
      difficulty: s.difficulty || 'Intermediate',
      requiredLevel: s.requiredLevel || 75,
      estimatedHours: s.estimatedHours || 60,
      isOptional: !!s.isOptional,
      resources: s.resources || {},
      proficiency: s.difficulty || 'Intermediate'
    }));

    await Skill.bulkCreate(skillRecords);
    console.log(`✅ Seeded ${skillRecords.length} benchmark skills into 'skills' table with role_id.`);

    // ========================================================================
    // 3. Seed Mock Interview Questions (100 Questions)
    // ========================================================================
    console.log(`❓ Seeding ${questionsData.length} mock interview questions...`);
    for (const q of questionsData) {
      await MockInterviewQuestion.upsert({
        id: q.id,
        type: q.type,
        category: q.category,
        role: q.role,
        difficulty: q.difficulty,
        question: q.question,
        followUps: q.followUps || [],
        sampleAnswer: q.sampleAnswer || {},
        expectedKeywords: q.expectedKeywords || [],
        indiaContextTip: q.indiaContextTip || null
      });
    }
    console.log(`✅ Seeded ${questionsData.length} questions into 'mock_interview_questions' table.`);

    // ========================================================================
    // 4. Seed Resources (100+ Curated Resources)
    // ========================================================================
    console.log(`📚 Seeding curated learning resources...`);
    // Flatten resources from map
    const flatResources = [];
    for (const [skillKey, list] of Object.entries(resourcesMap)) {
      if (Array.isArray(list)) {
        for (const item of list) {
          flatResources.push({
            skill: item.skill || skillKey,
            title: item.title,
            type: item.type || 'Documentation',
            url: item.url,
            free: item.free !== undefined ? item.free : true,
            description: item.description || null,
            level: item.level || 'Beginner',
            provider: item.provider || 'Official'
          });
        }
      }
    }

    // Clear existing resources and bulk insert
    await Resource.destroy({ where: {} });
    await Resource.bulkCreate(flatResources);
    console.log(`✅ Seeded ${flatResources.length} curated resources into 'resources' table.`);

    // ========================================================================
    // 5. Seed Popular Companies (25 Companies)
    // ========================================================================
    console.log(`🏢 Seeding ${popularCompaniesData.length} popular tech companies in India...`);
    for (const c of popularCompaniesData) {
      await PopularCompany.upsert({
        id: c.id,
        name: c.name,
        category: c.category,
        tier: c.tier,
        headquarters: c.headquarters,
        indiaOffices: c.indiaOffices,
        typicalRounds: c.typicalRounds,
        focusAreas: c.focusAreas,
        salaryRangeByLevel: c.salaryRangeByLevel,
        interviewTips: c.interviewTips,
        popularRoles: c.popularRoles
      });
    }
    console.log(`✅ Seeded ${popularCompaniesData.length} companies into 'popular_companies' table.`);

    // ========================================================================
    // 6. Seed Coding Topics (20 Topics)
    // ========================================================================
    console.log(`💻 Seeding ${codingTopicsData.length} coding problem topics...`);
    for (const t of codingTopicsData) {
      await CodingTopic.upsert({
        id: t.id,
        topicName: t.topicName,
        description: t.description,
        frequencyInIndiaInterviews: t.frequencyInIndiaInterviews,
        keyPatterns: t.keyPatterns,
        recommendedProblems: t.recommendedProblems
      });
    }
    console.log(`✅ Seeded ${codingTopicsData.length} topics into 'coding_topics' table.`);

    // ========================================================================
    // 7. Check or create demo user & application data
    // ========================================================================
    let demoUser = await User.findOne({ where: { email: 'demo@careercopilot.io' } });
    if (!demoUser) {
      console.log('👤 Creating default demo user...');
      demoUser = await User.create({
        name: 'Alex Morgan',
        fullName: 'Alex Morgan',
        email: 'demo@careercopilot.io',
        password: 'password123',
        targetRole: 'Full Stack Developer',
        experienceLevel: 'Mid-Level',
        bio: 'Software engineer passionate about scalable cloud architectures, React, and distributed backend systems.'
      });
      console.log(`✅ Demo user created: ${demoUser.email} / password123`);

      // Add sample job applications
      await Job.bulkCreate([
        {
          userId: demoUser.id,
          companyName: 'Razorpay',
          jobTitle: 'Senior Platform Engineer',
          jobLink: 'https://razorpay.com/careers/platform',
          stage: 'offer',
          dateApplied: '2026-09-10',
          interviewDate: '2026-09-22',
          notes: 'Passed all rounds. Received offer letter: ₹38 LPA - ₹44 LPA with joining bonus.',
          salary: '₹38 LPA - ₹44 LPA'
        },
        {
          userId: demoUser.id,
          companyName: 'Flipkart',
          jobTitle: 'SDE-2 (Checkout & Orders)',
          jobLink: 'https://flipkartcareers.com/jobs/sde2',
          stage: 'interview',
          dateApplied: '2026-09-20',
          interviewDate: '2026-10-08',
          notes: 'Completed Machine Coding (LLD). Next round is High-Level System Design (Big Billion Days scale).',
          salary: '₹40 LPA - ₹52 LPA'
        },
        {
          userId: demoUser.id,
          companyName: 'Swiggy',
          jobTitle: 'Backend Developer - Logistics Engine',
          jobLink: 'https://swiggy.com/careers/backend',
          stage: 'applied',
          dateApplied: '2026-09-28',
          interviewDate: null,
          notes: 'Referral submitted by engineering lead. Awaiting recruiter screening.',
          salary: '₹36 LPA - ₹48 LPA'
        },
        {
          userId: demoUser.id,
          companyName: 'Google India',
          jobTitle: 'Software Engineer III (L4)',
          jobLink: 'https://careers.google.com/jobs/results/bangalore',
          stage: 'applied',
          dateApplied: '2026-10-01',
          interviewDate: null,
          notes: 'Application submitted with distributed systems portfolio.',
          salary: '₹55 LPA - ₹75 LPA'
        }
      ]);

      // Add sample coding problems
      await CodingProblem.bulkCreate([
        {
          userId: demoUser.id,
          problemName: 'LRU Cache',
          topic: 'Design & Hash Tables',
          difficulty: 'Medium',
          timeTaken: 35,
          selfRating: 4,
          solved: true,
          notes: 'Implemented with doubly linked list + hash map for O(1) get and put operations.'
        },
        {
          userId: demoUser.id,
          problemName: 'Course Schedule (Cycle Detection)',
          topic: 'Graph',
          difficulty: 'Medium',
          timeTaken: 40,
          selfRating: 4,
          solved: true,
          notes: 'Used Kahn algorithm with in-degree array and queue.'
        },
        {
          userId: demoUser.id,
          problemName: 'Trapping Rain Water',
          topic: 'Array',
          difficulty: 'Hard',
          timeTaken: 50,
          selfRating: 3,
          solved: true,
          notes: 'Two-pointer approach comparing leftMax and rightMax.'
        }
      ]);

      console.log('✅ Demo job applications and coding practice logged.');
    } else {
      console.log('ℹ️ Demo user already exists.');
    }

    // ========================================================================
    // 8. Seed Feature 6: Company-Specific Interview Prep Data
    // ========================================================================
    console.log('🏢 Seeding Feature 6: Company-Specific Interview Prep data...');
    await seedCompanyData();

    console.log('\n========================================================');
    console.log('🎉 INDIA-SPECIFIC CAREER COPILOT SEEDING COMPLETE!');
    console.log(`- Roles in DB:             ${await Role.count()}`);
    console.log(`- Benchmark Skills in DB:  ${await Skill.count({ where: { userId: null } })}`);
    console.log(`- Questions in DB:         ${await MockInterviewQuestion.count()}`);
    console.log(`- Resources in DB:         ${await Resource.count()}`);
    console.log(`- Popular Companies in DB: ${await PopularCompany.count()}`);
    console.log(`- Coding Topics in DB:     ${await CodingTopic.count()}`);
    console.log('========================================================\n');

    return true;
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

if (require.main === module) {
  runSeeder()
    .then(() => {
      console.log('🚀 Seeding finished successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = runSeeder;
