// backend/test-coding-tracker.js
const axios = require('axios');
const app = require('./server');

let server;
const PORT = 5066;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('🚀 Starting Coding Practice Tracker Backend Verification Suite...');
  let token = '';
  let createdProblemId = '';
  let secondProblemId = '';

  try {
    // 1. Start test server
    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`📡 Test server running on port ${PORT}`);
        resolve();
      });
    });

    // 2. Authenticate
    console.log('\n--- TEST 1: Authenticate Demo User ---');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'demo@careercopilot.io',
      password: 'password123'
    });
    console.log('Login status:', loginRes.status, 'Success:', loginRes.data.success);
    token = loginRes.data.token;
    if (!token) throw new Error('Failed to obtain JWT token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 3. POST /api/coding/log (Log a solved problem)
    console.log('\n--- TEST 2: POST /api/coding/log (Log Solved Problem) ---');
    const solvedPayload = {
      problemName: 'Binary Tree Maximum Path Sum',
      topic: 'Tree',
      difficulty: 'Hard',
      timeTaken: 45,
      selfRating: 4,
      solved: true,
      notes: 'Post-order DFS with bottom-up max gain propagation.',
      date: new Date().toISOString()
    };
    const logRes = await axios.post(`${BASE_URL}/coding/log`, solvedPayload, authHeaders);
    console.log('Log problem status:', logRes.status, 'Success:', logRes.data.success);
    createdProblemId = logRes.data.problem.id;

    if (!createdProblemId) throw new Error('Problem ID not returned');
    if (logRes.data.problem.problemName !== 'Binary Tree Maximum Path Sum') throw new Error('Problem name mismatch');
    if (logRes.data.problem.topic !== 'Tree') throw new Error('Topic mismatch');
    if (logRes.data.problem.solved !== true) throw new Error('Solved boolean mismatch');
    if (logRes.data.problem.timeTaken !== 45) throw new Error('Time taken mismatch');
    if (!logRes.data.problem.nextReviewDate) throw new Error('Next review date missing');

    console.log('✅ Problem successfully logged with initial spaced repetition date:', logRes.data.problem.nextReviewDate);

    // 4. POST /api/coding/log (Log struggled problems in Dynamic Programming to test weak topics)
    console.log('\n--- TEST 3: Log Struggled Problems in DP ---');
    const dpPayload1 = {
      problemName: 'Word Break II',
      topic: 'Dynamic Programming',
      difficulty: 'Hard',
      timeTaken: 50,
      selfRating: 1,
      solved: false,
      notes: 'Failed to memoize recursive partitions efficiently.'
    };
    const logRes2 = await axios.post(`${BASE_URL}/coding/log`, dpPayload1, authHeaders);
    secondProblemId = logRes2.data.problem.id;
    if (logRes2.data.problem.solved !== false) throw new Error('Solved should be false');

    const dpPayload2 = {
      problemName: 'Longest Valid Parentheses',
      topic: 'Dynamic Programming',
      difficulty: 'Hard',
      timeTaken: 40,
      selfRating: 2,
      solved: false,
      notes: 'Tricky edge cases on stack indices.'
    };
    await axios.post(`${BASE_URL}/coding/log`, dpPayload2, authHeaders);
    console.log('✅ Struggled DP problems logged.');

    // 5. GET /api/coding/problems
    console.log('\n--- TEST 4: GET /api/coding/problems ---');
    const getProblemsRes = await axios.get(`${BASE_URL}/coding/problems`, authHeaders);
    console.log(`Fetched ${getProblemsRes.data.count} problems`);
    const foundCreated = getProblemsRes.data.problems.find(p => p.id === createdProblemId);
    if (!foundCreated) throw new Error('Created problem not found in GET /api/coding/problems');

    // Test search filter
    const searchRes = await axios.get(`${BASE_URL}/coding/problems?search=Maximum+Path`, authHeaders);
    if (!searchRes.data.problems.some(p => p.id === createdProblemId)) {
      throw new Error('Search by problem name failed');
    }
    console.log('✅ Problem search and filter working.');

    // 6. GET /api/coding/weak-topics (<70% success rate)
    console.log('\n--- TEST 5: GET /api/coding/weak-topics (<70% threshold) ---');
    const weakRes = await axios.get(`${BASE_URL}/coding/weak-topics`, authHeaders);
    console.log('Weak Topics detected:', JSON.stringify(weakRes.data.weakTopics, null, 2));

    const dpWeak = weakRes.data.weakTopics.find(w => w.topic === 'Dynamic Programming');
    if (!dpWeak) throw new Error('Dynamic Programming should be listed as weak topic');
    if (dpWeak.successRate >= 70) throw new Error('DP success rate should be < 70%');
    console.log(`✅ Weak topic verified: DP has ${dpWeak.successRate}% success rate (solved: ${dpWeak.solved}/${dpWeak.total})`);

    // 7. GET /api/coding/stats
    console.log('\n--- TEST 6: GET /api/coding/stats ---');
    const statsRes = await axios.get(`${BASE_URL}/coding/stats`, authHeaders);
    const stats = statsRes.data.stats;
    console.log('Coding Stats Summary:', {
      total: stats.totalProblems,
      solved: stats.totalSolved,
      successRate: `${stats.successRate}%`,
      averageTime: `${stats.averageTime} mins`,
      weakTopicsCount: stats.weakTopicsCount,
      difficultyCounts: stats.difficultyCounts,
      timeTrends: stats.timeTrends?.trend
    });

    if (stats.totalProblems === undefined || stats.totalSolved === undefined) {
      throw new Error('Stats missing total/solved counts');
    }
    if (stats.successRate === undefined) throw new Error('Stats missing successRate');
    if (!stats.difficultyCounts) throw new Error('Stats missing difficultyCounts');
    if (!stats.topicDistribution) throw new Error('Stats missing topicDistribution');
    if (!stats.timeTrends) throw new Error('Stats missing timeTrends');
    console.log('✅ Coding stats calculation verified.');

    // 8. GET /api/coding/spaced-repetition
    console.log('\n--- TEST 7: GET /api/coding/spaced-repetition ---');
    const srRes = await axios.get(`${BASE_URL}/coding/spaced-repetition`, authHeaders);
    console.log('Spaced Repetition response:', {
      dueCount: srRes.data.dueCount,
      totalDue: srRes.data.dueProblems.length,
      upcomingCount: srRes.data.upcomingProblems.length,
      intervals: srRes.data.intervals
    });

    if (!Array.isArray(srRes.data.intervals) || srRes.data.intervals.length !== 5) {
      throw new Error('Intervals must be [1, 3, 7, 14, 30]');
    }
    console.log('✅ Spaced repetition schedule verified.');

    // 9. POST /api/coding/:id/review (Mark review complete)
    console.log('\n--- TEST 8: POST /api/coding/:id/review ---');
    const reviewRes = await axios.post(`${BASE_URL}/coding/${createdProblemId}/review`, {
      selfRating: 5,
      notes: 'Reviewed again. Path sum recurrence is second nature now.'
    }, authHeaders);
    console.log('Review response:', reviewRes.data.message);
    if (reviewRes.data.problem.reviewStage !== 1) {
      throw new Error(`Review stage expected 1, got ${reviewRes.data.problem.reviewStage}`);
    }
    if (!reviewRes.data.problem.lastReviewedAt) {
      throw new Error('lastReviewedAt should be populated after review');
    }
    console.log('✅ Spaced repetition review advance verified. Next stage:', reviewRes.data.problem.reviewStage);

    // 10. Input Validation
    console.log('\n--- TEST 9: Input Validations ---');
    try {
      await axios.post(`${BASE_URL}/coding/log`, {
        problemName: ''
      }, authHeaders);
      throw new Error('Should reject empty problem name');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('Correctly rejected empty problemName:', err.response.data.message);
      } else throw err;
    }

    try {
      await axios.post(`${BASE_URL}/coding/log`, {
        problemName: 'Two Sum',
        timeTaken: -5
      }, authHeaders);
      throw new Error('Should reject negative timeTaken');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('Correctly rejected negative timeTaken:', err.response.data.message);
      } else throw err;
    }

    // 11. Cleanup test problems
    console.log('\n--- TEST 10: DELETE /api/coding/:id ---');
    await axios.delete(`${BASE_URL}/coding/${createdProblemId}`, authHeaders);
    await axios.delete(`${BASE_URL}/coding/${secondProblemId}`, authHeaders);
    console.log('✅ Test problems cleaned up.');

    console.log('\n🎉 ALL 10 CODING PRACTICE TRACKER BACKEND TESTS PASSED PERFECTLY!\n');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests();
