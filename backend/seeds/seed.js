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
          jobTitle: 'Fullstack Software Engineer',
          jobLink: 'https://stripe.com/jobs/fullstack-eng',
          stage: 'interview',
          dateApplied: '2026-09-20',
          interviewDate: '2026-10-06',
          notes: 'Completed technical screen. Next round is system design and architecture deep dive.',
          salary: '$145,000 - $175,000'
        },
        {
          userId: demoUser.id,
          companyName: 'Datadog',
          jobTitle: 'Backend Engineer - Cloud Platform',
          jobLink: 'https://datadog.com/careers/backend',
          stage: 'applied',
          dateApplied: '2026-09-28',
          interviewDate: null,
          notes: 'Referral submitted via engineering alum. Awaiting recruiter response.',
          salary: '$150,000 - $180,000'
        },
        {
          userId: demoUser.id,
          companyName: 'Razorpay',
          jobTitle: 'Senior Platform Engineer',
          jobLink: 'https://razorpay.com/careers/platform',
          stage: 'offer',
          dateApplied: '2026-09-10',
          interviewDate: '2026-09-22',
          notes: 'Final rounds passed. Received formal offer letter! Negotiating CTC and joining bonus.',
          salary: '₹38 LPA - ₹44 LPA'
        },
        {
          userId: demoUser.id,
          companyName: 'Vercel',
          jobTitle: 'Frontend Infrastructure Engineer',
          jobLink: 'https://vercel.com/careers/frontend',
          stage: 'applied',
          dateApplied: '2026-10-01',
          interviewDate: null,
          notes: 'Submitted application with Next.js portfolio and open source contributions.',
          salary: '$140,000 - $170,000'
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
