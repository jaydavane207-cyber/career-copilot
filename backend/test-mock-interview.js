// backend/test-mock-interview.js
const http = require('http');
const app = require('./server');
const jwt = require('jsonwebtoken');
const env = require('./config/env');
const { User, MockInterview } = require('./models');
const questionsData = require('./seeds/questions.json');

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

const runTests = async () => {
  console.log('--- 1. Validating Question Bank Counts ---');
  const behavioral = questionsData.filter(q => q.type === 'Behavioral');
  const technical = questionsData.filter(q => q.type === 'Technical');
  const systemDesign = questionsData.filter(q => q.type === 'System Design');

  console.log(`Behavioral: ${behavioral.length}/35`);
  console.log(`Technical: ${technical.length}/40`);
  console.log(`System Design: ${systemDesign.length}/25`);
  console.log(`Total: ${questionsData.length}/100`);

  if (behavioral.length !== 35 || technical.length !== 40 || systemDesign.length !== 25 || questionsData.length !== 100) {
    throw new Error('Question bank counts do not match expected 35/40/25/100 distribution!');
  }

  // Ensure every question has strongAnswer, keyPoints, tips
  for (const q of questionsData) {
    if (!q.sampleAnswer || !q.sampleAnswer.strongAnswer || !Array.isArray(q.sampleAnswer.keyPoints) || !q.sampleAnswer.tips) {
      throw new Error(`Question ${q.id} is missing sampleAnswer, keyPoints, or tips!`);
    }
  }
  console.log('✅ All 100 questions possess valid strongAnswer, keyPoints, and tips.');

  // Create or find a test user
  const testEmail = `interview_test_${Date.now()}@test.com`;
  const testUser = await User.create({
    name: 'Interview Candidate',
    email: testEmail,
    password: 'Password123!',
    targetRole: 'Fullstack Developer'
  });

  const token = jwt.sign(
    { userId: testUser.id, email: testUser.email, targetRole: testUser.targetRole },
    env.JWT_SECRET || 'career_copilot_secret',
    { expiresIn: '1h' }
  );

  const authHeader = { Authorization: `Bearer ${token}` };

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`\nTest server listening on port ${port}`);

  try {
    console.log('\n--- 2. Testing GET /api/mock-interview/questions (Behavioral 3 questions) ---');
    const resB3 = await makeRequest(server, {
      path: '/api/mock-interview/questions?type=Behavioral&count=3',
      method: 'GET',
      headers: authHeader
    });
    console.log('Status:', resB3.status, 'Returned count:', resB3.body.count);
    if (resB3.status !== 200 || resB3.body.questions.length !== 3) {
      throw new Error('Failed to get 3 behavioral questions');
    }
    // Verify no sample answer leaked to client during question retrieval
    if (resB3.body.questions[0].sampleAnswer) {
      throw new Error('sampleAnswer should not be included in active questions response!');
    }
    // Verify all are behavioral
    if (!resB3.body.questions.every(q => q.type === 'Behavioral')) {
      throw new Error('Expected all returned questions to be Behavioral');
    }
    // Verify no duplicates
    const ids = resB3.body.questions.map(q => q.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error('Duplicate questions returned in session!');
    }
    console.log('✅ GET questions returned 3 unique Behavioral questions without answer leak.');

    console.log('\n--- 3. Testing GET /api/mock-interview/questions (Technical 5 & System Design 10) ---');
    const resT5 = await makeRequest(server, {
      path: '/api/mock-interview/questions?type=Technical&count=5',
      method: 'GET',
      headers: authHeader
    });
    console.log('Technical Status:', resT5.status, 'Count:', resT5.body.count);
    if (resT5.body.questions.length !== 5) throw new Error('Expected 5 technical questions');

    const resS10 = await makeRequest(server, {
      path: '/api/mock-interview/questions?type=System Design&count=10',
      method: 'GET',
      headers: authHeader
    });
    console.log('System Design Status:', resS10.status, 'Count:', resS10.body.count);
    if (resS10.body.questions.length !== 10) throw new Error('Expected 10 system design questions');
    console.log('✅ Technical (5) and System Design (10) randomized question pools verified.');

    console.log('\n--- 4. Testing POST /api/mock-interview/submit-answer ---');
    const sampleSubmission = {
      interviewType: 'Behavioral',
      role: 'Fullstack Developer',
      answers: [
        {
          questionId: resB3.body.questions[0].id,
          question: resB3.body.questions[0].question,
          userAnswer: 'I follow the present past future structure. I have 3 years of software engineering experience in microservices and scalable React architectures.',
          confidence: 4,
          answerLength: 154
        },
        {
          questionId: resB3.body.questions[1].id,
          question: resB3.body.questions[1].question,
          userAnswer: 'I use the STAR method. In a high traffic flash sale, I introduced Redis locks and Kafka to queue processing, improving throughput by 400%.',
          confidence: 5,
          answerLength: 148
        },
        {
          questionId: resB3.body.questions[2].id,
          question: resB3.body.questions[2].question,
          userAnswer: 'When resolving technical conflicts, I focus on data-driven benchmarks and architectural decision records.',
          confidence: 4,
          answerLength: 105
        }
      ],
      sessionStats: {
        totalQuestions: 3,
        timeSpent: 360,
        avgConfidence: 4.3
      }
    };

    const submitRes = await makeRequest(server, {
      path: '/api/mock-interview/submit-answer',
      method: 'POST',
      headers: authHeader
    }, sampleSubmission);

    console.log('Submit Status:', submitRes.status, 'Message:', submitRes.body.message);
    if (submitRes.status !== 200 || !submitRes.body.success) {
      throw new Error(`Submit answer failed: ${JSON.stringify(submitRes.body)}`);
    }
    const savedResult = submitRes.body.result;
    console.log('Overall Score:', savedResult.overallScore);
    console.log('Avg Confidence:', savedResult.sessionStats?.avgConfidence);
    console.log('Saved Answers count:', savedResult.answers?.length);

    // Verify sampleAnswer is now enriched in the returned evaluated session
    if (!savedResult.answers[0].sampleAnswer || !savedResult.answers[0].sampleAnswer.strongAnswer) {
      throw new Error('Expected sampleAnswer to be attached to submitted answer response!');
    }
    console.log('✅ POST /submit-answer successfully evaluated, enriched with sample answers, and persisted.');

    console.log('\n--- 5. Testing GET /api/mock-interview/history ---');
    const historyRes = await makeRequest(server, {
      path: '/api/mock-interview/history',
      method: 'GET',
      headers: authHeader
    });
    console.log('History Status:', historyRes.status, 'Count:', historyRes.body.count);
    if (historyRes.status !== 200 || historyRes.body.count < 1) {
      throw new Error('Expected history to return at least 1 session');
    }
    const sessionInHistory = historyRes.body.history[0];
    if (sessionInHistory.id !== savedResult.id) {
      throw new Error('History session ID does not match recently saved session');
    }
    console.log('✅ GET /history successfully returned candidate interview attempts.');

    console.log('\n--- 6. Testing GET /api/mock-interview/feedback ---');
    const feedbackRes = await makeRequest(server, {
      path: `/api/mock-interview/feedback?questionIds=${resB3.body.questions[0].id},${resB3.body.questions[1].id}`,
      method: 'GET',
      headers: authHeader
    });
    console.log('Feedback Status:', feedbackRes.status, 'Count:', feedbackRes.body.feedback?.length);
    if (feedbackRes.status !== 200 || feedbackRes.body.feedback?.length !== 2) {
      throw new Error('Feedback endpoint did not return requested sample answers');
    }
    console.log('Sample Strong Answer snippet:', feedbackRes.body.feedback[0].strongAnswer.slice(0, 60) + '...');
    console.log('Key Points:', feedbackRes.body.feedback[0].keyPoints);
    console.log('Tips snippet:', feedbackRes.body.feedback[0].tips.slice(0, 50) + '...');
    console.log('✅ GET /feedback successfully returned detailed sample answers, checklist, and tips.');

    console.log('\n🎉 ALL BACKEND MOCK INTERVIEW TESTS PASSED FLAWLESSLY!\n');
  } finally {
    server.close();
  }
};

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
