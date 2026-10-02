// backend/seeds/seed.js
const { sequelize, User, Job, CodingProblem, StudyPlan } = require('../models');
const { testConnection } = require('../config/database');
const rolesData = require('./roles.json');
const skillsData = require('./skills.json');
const questionsData = require('./questions.json');

const runSeeder = async () => {
  try {
    console.log('🌱 Testing database connection...');
    await testConnection();

    console.log('🔄 Synchronizing models with database...');
    await sequelize.sync({ alter: true });

    // Check or create demo user
    let demoUser = await User.findOne({ where: { email: 'demo@careercopilot.io' } });
    if (!demoUser) {
      console.log('👤 Creating default demo user...');
      demoUser = await User.create({
        name: 'Alex Morgan',
        fullName: 'Alex Morgan',
        email: 'demo@careercopilot.io',
        password: 'password123',
        targetRole: 'Fullstack Developer',
        experienceLevel: 'Mid-Level',
        bio: 'Software engineer passionate about scalable cloud architectures, React, and distributed backend systems.'
      });
      console.log(`✅ Demo user created: ${demoUser.email} / password123`);

      // Add sample job applications
      await Job.bulkCreate([
        {
          userId: demoUser.id,
          companyName: 'Stripe',
          positionTitle: 'Fullstack Software Engineer',
          status: 'Interviewing',
          workType: 'Remote',
          location: 'San Francisco, CA (Remote)',
          salaryRange: '$145,000 - $175,000',
          deadline: '2026-10-15',
          appliedDate: '2026-09-20',
          notes: 'Completed technical screen. Next round is system design and architecture deep dive.'
        },
        {
          userId: demoUser.id,
          companyName: 'Datadog',
          positionTitle: 'Backend Engineer - Cloud Platform',
          status: 'Applied',
          workType: 'Hybrid',
          location: 'New York, NY',
          salaryRange: '$150,000 - $180,000',
          deadline: '2026-10-25',
          appliedDate: '2026-09-28',
          notes: 'Referral submitted via engineering alum.'
        },
        {
          userId: demoUser.id,
          companyName: 'Vercel',
          positionTitle: 'Frontend Infrastructure Engineer',
          status: 'Wishlist',
          workType: 'Remote',
          location: 'Worldwide Remote',
          salaryRange: '$140,000 - $170,000',
          notes: 'Prepare open source contributions before applying.'
        }
      ]);

      // Add sample coding problems
      await CodingProblem.bulkCreate([
        {
          userId: demoUser.id,
          title: 'LRU Cache',
          platform: 'LeetCode',
          difficulty: 'Medium',
          topic: 'Design & Hash Tables',
          status: 'Solved',
          timeSpentMinutes: 35,
          solutionNotes: 'Implemented with doubly linked list + hash map for O(1) get and put operations.'
        },
        {
          userId: demoUser.id,
          title: 'Course Schedule (Cycle Detection)',
          platform: 'LeetCode',
          difficulty: 'Medium',
          topic: 'Graphs (Topological Sort)',
          status: 'Solved',
          timeSpentMinutes: 40,
          solutionNotes: 'Used Kahn algorithm with in-degree array and queue.'
        },
        {
          userId: demoUser.id,
          title: 'Trapping Rain Water',
          platform: 'LeetCode',
          difficulty: 'Hard',
          topic: 'Two Pointers',
          status: 'Review',
          timeSpentMinutes: 50,
          solutionNotes: 'Revisit two-pointer approach vs monotonic stack.'
        }
      ]);

      console.log('✅ Demo job applications and coding practice logged.');
    } else {
      console.log('ℹ️ Demo user already exists.');
    }

    console.log(`✅ Seed verification complete. Loaded ${rolesData.length} roles, ${skillsData.length} skills, and ${questionsData.length} questions.`);
    return true;
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

if (require.main === module) {
  runSeeder()
    .then(() => {
      console.log('🎉 Seeding successfully completed!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = runSeeder;
