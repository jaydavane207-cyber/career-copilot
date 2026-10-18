// backend/test-interview-feature.js
require('./config/env');
const { sequelize } = require('./config/database');
const { User, Interview, InterviewPrepLog, Job, Company } = require('./models');
const interviewController = require('./controllers/interviewController');
const { generatePrepPlanForInterview } = require('./utils/interviewPrepAutomation');
const { analyzeAnswer } = require('./utils/interviewAnswerAnalyzer');

async function runTests() {
  console.log('🧪 Starting Advanced Interview Module Unit Tests...');
  try {
    await sequelize.authenticate();
    await Interview.sync();
    await InterviewPrepLog.sync();
    console.log('✅ 1. Database models & tables verified.');

    // 1. Get or create test user
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Test Candidate',
        email: `test_candidate_${Date.now()}@example.com`,
        password: 'hashed_password_123',
        targetRole: 'Full Stack Engineer'
      });
      console.log('✅ Created test user:', user.id);
    } else {
      console.log('✅ Found existing test user:', user.id);
    }

    // 2. Create Interview
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(14, 30, 0, 0);

    const createdInterview = await interviewController.createInterview(user.id, {
      companyName: 'Google',
      roleTitle: 'Senior Software Engineer',
      stage: 'Round 2',
      interviewType: 'system_design',
      mode: 'online',
      interviewDatetime: targetDate.toISOString(),
      durationMinutes: 45,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Focus on distributed cache and rate limiting.'
    });

    console.log('✅ 2. Created interview successfully:', {
      id: createdInterview.id,
      company: createdInterview.companyName,
      role: createdInterview.roleTitle,
      stage: createdInterview.stage,
      type: createdInterview.interviewType,
      time: createdInterview.interviewDatetime
    });

    // 3. Query Interviews
    const allInterviews = await interviewController.getInterviews(user.id);
    console.log(`✅ 3. Fetched ${allInterviews.length} interviews for user.`);

    const upcoming = await interviewController.getUpcomingInterviews(user.id, 5);
    console.log(`✅ 4. Fetched ${upcoming.length} upcoming interviews.`);

    // 4. Test Smart Prep Automation
    const prepPlan = await generatePrepPlanForInterview(user.id, createdInterview);
    console.log('✅ 5. Generated Smart Prep Plan:');
    console.log(`   - Urgency Level: ${prepPlan.urgencyLevel}`);
    console.log(`   - Time Until: ${prepPlan.timeUntil}`);
    console.log(`   - Daily Plan Days: ${prepPlan.dailyPlan.length}`);
    console.log(`   - First Day Tasks: ${prepPlan.dailyPlan[0]?.tasks.length}`);
    console.log(`   - Readiness Score: ${prepPlan.stats.readinessScore}%`);
    console.log(`   - Google Calendar Link Generated: ${!!prepPlan.quickLinks.calendarEvent}`);

    // 5. Test Logging a prep task
    const log = await interviewController.logPrepTask(user.id, createdInterview.id, {
      taskType: 'system_design_question',
      description: 'Completed system design practice for URL shortener'
    });
    console.log('✅ 6. Logged prep task:', log.taskType, log.description);

    const logs = await interviewController.getInterviewPrepLogs(user.id, createdInterview.id);
    console.log(`✅ 7. Retrieved ${logs.length} prep logs for interview.`);

    // 6. Test AI Answer Feedback
    console.log('🤖 8. Testing AI Answer Feedback...');
    const feedback = await analyzeAnswer(
      'Tell me about a time you resolved a major production incident.',
      'During a Black Friday spike, our checkout service latency jumped from 200ms to 4s due to database connection pool exhaustion. I coordinated with the DevOps lead, quickly identified unindexed order status queries, applied an urgent indexing migration, and scaled up the connection pool. We brought latency down to 180ms within 20 minutes, preventing an estimated $50,000 in lost revenue. Afterwards, I instituted connection pool metrics alerts and load testing before all major campaigns.',
      'Senior Software Engineer',
      'Google'
    );
    console.log('✅ AI Feedback Result:');
    console.log(`   - Score: ${feedback.score}/100`);
    console.log(`   - Strengths (${feedback.strengths.length}):`, feedback.strengths);
    console.log(`   - Improvements (${feedback.improvements.length}):`, feedback.improvements);
    console.log(`   - Tags:`, feedback.tags);
    console.log(`   - Suggested Better Answer snippet:`, feedback.suggestedBetterAnswer?.slice(0, 100) + '...');

    // 7. Update Interview
    const updated = await interviewController.updateInterview(user.id, createdInterview.id, {
      stage: 'Final Round',
      durationMinutes: 60
    });
    console.log(`✅ 9. Updated interview stage to: ${updated.stage}, duration: ${updated.durationMinutes}m`);

    // Clean up test interview
    await interviewController.deleteInterview(user.id, createdInterview.id);
    console.log('✅ 10. Cleaned up test interview. All backend tests passed successfully! 🎉');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runTests();
