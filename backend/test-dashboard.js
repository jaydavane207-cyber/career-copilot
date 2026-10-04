// backend/test-dashboard.js
const http = require('http');
const app = require('./server');
const jwt = require('jsonwebtoken');
const env = require('./config/env');
const { User, Resume, Skill, StudyPlan, MockInterview, Job, CodingProblem } = require('./models');

const makeRequest = (server, options, postData) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: encodeURI(options.path),
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runDashboardTests = async () => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`🧪 Test server started on ephemeral port ${port}`);

  try {
    // 1. Get or create test user
    let user = await User.findOne({ where: { email: 'dashboard_test@careercopilot.io' } });
    if (!user) {
      user = await User.create({
        name: 'Dashboard Tester',
        email: 'dashboard_test@careercopilot.io',
        password: 'password123',
        targetRole: 'Frontend Developer'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'user' },
      env.JWT_SECRET || 'career_copilot_jwt_secret_dev_key_2026',
      { expiresIn: '1h' }
    );
    const authHeaders = { Authorization: `Bearer ${token}` };

    console.log('\n--- Test 1: GET /api/dashboard/readiness-score ---');
    const scoreRes = await makeRequest(server, {
      path: '/api/dashboard/readiness-score',
      method: 'GET',
      headers: authHeaders
    });

    console.log(`Status: ${scoreRes.status}`);
    console.log('Response:', JSON.stringify(scoreRes.body, null, 2));

    if (scoreRes.status !== 200 || !scoreRes.body.success) {
      throw new Error('GET /api/dashboard/readiness-score failed');
    }
    if (typeof scoreRes.body.readinessScore !== 'number') {
      throw new Error('readinessScore is not a number');
    }
    if (!['Start Here', 'Getting There', 'Ready!'].includes(scoreRes.body.readinessLabel)) {
      throw new Error(`Invalid readinessLabel: ${scoreRes.body.readinessLabel}`);
    }
    if (!Array.isArray(scoreRes.body.nextActions)) {
      throw new Error('nextActions is not an array');
    }
    if (!scoreRes.body.summary) {
      throw new Error('summary is missing');
    }
    console.log('✅ GET /api/dashboard/readiness-score passed schema validation!');

    console.log('\n--- Test 2: GET /api/dashboard ---');
    const dashRes = await makeRequest(server, {
      path: '/api/dashboard',
      method: 'GET',
      headers: authHeaders
    });

    console.log(`Status: ${dashRes.status}`);
    console.log('Summary metrics:', dashRes.body.summary);
    console.log('Breakdown count:', dashRes.body.breakdown?.length);
    console.log('Recent activities count:', dashRes.body.recentActivities?.length);
    console.log('Recommendations count:', dashRes.body.recommendations?.length);

    if (dashRes.status !== 200 || !dashRes.body.success) {
      throw new Error('GET /api/dashboard failed');
    }
    if (!dashRes.body.breakdown || dashRes.body.breakdown.length !== 4) {
      throw new Error('Breakdown must contain 4 modules');
    }
    if (!dashRes.body.chartStackedData) {
      throw new Error('chartStackedData is missing');
    }
    console.log('✅ GET /api/dashboard passed all checks!');

    console.log('\n--- Test 3: Formula Verification With Populated Data ---');
    // Clean up any previous test items for this user
    await Resume.destroy({ where: { userId: user.id } });
    await Skill.destroy({ where: { userId: user.id } });
    await StudyPlan.destroy({ where: { userId: user.id } });
    await MockInterview.destroy({ where: { userId: user.id } });
    await Job.destroy({ where: { userId: user.id } });
    await CodingProblem.destroy({ where: { userId: user.id } });

    // 1. Resume with match score 80
    await Resume.create({
      userId: user.id,
      fileName: 'alex_frontend.pdf',
      originalName: 'alex_frontend.pdf',
      filePath: 'uploads/alex_frontend.pdf',
      fileSize: 1024,
      extractedText: 'Frontend Developer React JavaScript HTML CSS',
      targetRole: 'Frontend Developer',
      atsScore: 80,
      analyses: [{ id: '1', jobTitle: 'Frontend Developer', matchScore: 80 }]
    });

    // 2. Skills: Frontend Developer core skills are JavaScript, TypeScript, React, HTML5, CSS3, Tailwind CSS, Next.js, Redux, REST APIs, Git
    // Let's add skills to achieve skillGapScore
    // If role has 10 core skills, adding 6 gives 60%, or let's add 6 core skills:
    await Skill.bulkCreate([
      { userId: user.id, skillName: 'JavaScript', proficiency: 'Advanced' },
      { userId: user.id, skillName: 'React', proficiency: 'Advanced' },
      { userId: user.id, skillName: 'HTML5', proficiency: 'Advanced' },
      { userId: user.id, skillName: 'CSS3', proficiency: 'Intermediate' },
      { userId: user.id, skillName: 'Tailwind CSS', proficiency: 'Intermediate' },
      { userId: user.id, skillName: 'Git', proficiency: 'Intermediate' }
    ]);

    // 3. Active Study Plan with 50% progress
    await StudyPlan.create({
      userId: user.id,
      title: 'Frontend Master Plan',
      targetRole: 'Frontend Developer',
      durationWeeks: 4,
      hoursPerWeek: 10,
      progress: 50,
      isActive: true,
      weeklyModules: []
    });

    // 4. Mock Interview with average confidence 75% (3.75 / 5) or overallScore 75
    await MockInterview.create({
      userId: user.id,
      role: 'Frontend Developer',
      interviewType: 'Technical',
      overallScore: 75,
      sessionStats: { totalQuestions: 5, timeSpent: 900, avgConfidence: 3.75 },
      answers: [{ confidence: 4 }, { confidence: 3.5 }]
    });

    // 5. Jobs: 5 applied, 1 interview
    await Job.bulkCreate([
      { userId: user.id, companyName: 'Google', jobTitle: 'Frontend Engineer', stage: 'interview' },
      { userId: user.id, companyName: 'Meta', jobTitle: 'UI Engineer', stage: 'applied' },
      { userId: user.id, companyName: 'Netflix', jobTitle: 'Frontend Engineer', stage: 'applied' },
      { userId: user.id, companyName: 'Amazon', jobTitle: 'Frontend Engineer', stage: 'applied' },
      { userId: user.id, companyName: 'Stripe', jobTitle: 'Frontend Engineer', stage: 'applied' }
    ]);

    // 6. Coding problems: 23 solved
    const sampleProblems = [];
    for (let i = 1; i <= 23; i++) {
      sampleProblems.push({
        userId: user.id,
        problemName: `Problem ${i}`,
        topic: i % 2 === 0 ? 'React' : 'Array',
        difficulty: 'Medium',
        status: 'Solved',
        timeSpentMinutes: 30
      });
    }
    await CodingProblem.bulkCreate(sampleProblems);

    const populatedRes = await makeRequest(server, {
      path: '/api/dashboard',
      method: 'GET',
      headers: authHeaders
    });

    console.log('Populated response scores:', {
      readinessScore: populatedRes.body.readinessScore,
      readinessLabel: populatedRes.body.readinessLabel,
      resumeScore: populatedRes.body.resumeScore,
      skillGapScore: populatedRes.body.skillGapScore,
      studyProgress: populatedRes.body.studyProgress,
      interviewScore: populatedRes.body.interviewScore,
      summary: populatedRes.body.summary,
      nextActions: populatedRes.body.nextActions
    });

    if (populatedRes.body.resumeScore !== 80) {
      throw new Error(`Expected resumeScore 80, got ${populatedRes.body.resumeScore}`);
    }
    if (populatedRes.body.studyProgress !== 50) {
      throw new Error(`Expected studyProgress 50, got ${populatedRes.body.studyProgress}`);
    }
    if (populatedRes.body.interviewScore !== 75) {
      throw new Error(`Expected interviewScore 75, got ${populatedRes.body.interviewScore}`);
    }
    if (populatedRes.body.summary.totalJobsApplied !== 5) {
      throw new Error(`Expected totalJobsApplied 5, got ${populatedRes.body.summary.totalJobsApplied}`);
    }
    if (populatedRes.body.summary.interviews !== 1) {
      throw new Error(`Expected interviews 1, got ${populatedRes.body.summary.interviews}`);
    }
    if (populatedRes.body.summary.codesProblemsLogged !== 23) {
      throw new Error(`Expected codesProblemsLogged 23, got ${populatedRes.body.summary.codesProblemsLogged}`);
    }
    console.log('✅ Populated dashboard data and formula verified successfully!');

    console.log('\n🎉 All backend dashboard tests passed successfully!');
  } finally {
    server.close();
  }
};

if (require.main === module) {
  runDashboardTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Dashboard tests failed:', err);
      process.exit(1);
    });
}

module.exports = runDashboardTests;
