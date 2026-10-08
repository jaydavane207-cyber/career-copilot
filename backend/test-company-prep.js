// backend/test-company-prep.js
/**
 * Test script for Feature 6: Company-Specific Interview Prep
 */
const axios = require('axios');
const jwt = require('jsonwebtoken');
const env = require('./config/env');
const { User, Company } = require('./models');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Company Prep API tests...\n');

  try {
    // 1. Health check
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthRes.data.status);

    // 2. GET all companies
    const allRes = await axios.get(`${BASE_URL}/company/all?search=goo`);
    console.log(`✅ GET /api/company/all?search=goo: Found ${allRes.data.companies.length} companies.`);
    if (allRes.data.companies.length > 0) {
      console.log(`   Sample: ${allRes.data.companies[0].name} (Difficulty: ${allRes.data.companies[0].difficulty}, Questions: ${allRes.data.companies[0].questions_count})`);
    }

    // 3. Find Google
    const google = await Company.findOne({ where: { name: 'Google' } });
    if (!google) throw new Error('Google not found in seeded companies!');
    const googleId = google.id;

    // 4. GET company details
    const detailsRes = await axios.get(`${BASE_URL}/company/${googleId}`);
    console.log(`✅ GET /api/company/${googleId} (Google): Overall rating: ${detailsRes.data.ratings.overall}, Rounds: ${detailsRes.data.interview_process.length}`);

    // 5. GET questions by role
    const qRes = await axios.get(`${BASE_URL}/company/${googleId}/questions?role=Senior`);
    console.log(`✅ GET /api/company/${googleId}/questions?role=Senior: ${qRes.data.questions.length} questions returned.`);

    // 6. GET salary
    const salRes = await axios.get(`${BASE_URL}/company/${googleId}/salary?role=Senior%20Software%20Engineer`);
    console.log(`✅ GET /api/company/${googleId}/salary: Avg Base: $${salRes.data.salary.average.toLocaleString()}, Total Comp: $${salRes.data.total_comp.average.toLocaleString()}`);

    // 7. GET success stories
    const storiesRes = await axios.get(`${BASE_URL}/company/${googleId}/success-stories`);
    console.log(`✅ GET /api/company/${googleId}/success-stories: ${storiesRes.data.stories.length} stories found.`);

    // 8. GET reviews
    const reviewsRes = await axios.get(`${BASE_URL}/company/${googleId}/reviews`);
    console.log(`✅ GET /api/company/${googleId}/reviews: ${reviewsRes.data.reviews.length} reviews, Avg Rating: ${reviewsRes.data.average_rating}`);

    // 9. GET interview process
    const procRes = await axios.get(`${BASE_URL}/company/${googleId}/interview-process`);
    console.log(`✅ GET /api/company/${googleId}/interview-process: ${procRes.data.rounds.length} rounds returned.`);

    // 10. Test Protected Endpoints: Create/find a test user
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Test Prep User',
        email: `prep_test_${Date.now()}@test.com`,
        password: 'password123'
      });
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '1h' });
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 11. POST /api/company/prepare
    const prepRes = await axios.post(`${BASE_URL}/company/prepare`, {
      companyId: googleId,
      role: 'Senior Software Engineer',
      interviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }, authHeaders);
    console.log(`✅ POST /api/company/prepare: Plan created! Prep ID: ${prepRes.data.prep_id}, Days: ${prepRes.data.days_until_interview}`);

    const prepId = prepRes.data.prep_id;

    // 12. GET /api/company/:id/personalized-questions
    const pQRes = await axios.get(`${BASE_URL}/company/${googleId}/personalized-questions?role=Senior&count=3`, authHeaders);
    console.log(`✅ GET /api/company/${googleId}/personalized-questions: Returned ${pQRes.data.questions.length} tailored questions.`);

    // 13. PUT /api/company/prepare/:prepId/progress
    const progRes = await axios.put(`${BASE_URL}/company/prepare/${prepId}/progress`, {
      questionsAnswered: 5,
      interviewsCompleted: 1
    }, authHeaders);
    console.log(`✅ PUT /api/company/prepare/:prepId/progress: Readiness score: ${progRes.data.readiness_score}%, Status: ${progRes.data.preparation_status}`);

    // 14. GET user preparations
    const myPrepsRes = await axios.get(`${BASE_URL}/company/user/preparations`, authHeaders);
    console.log(`✅ GET /api/company/user/preparations: Found ${myPrepsRes.data.preparations.length} active preparations.`);

    // 15. POST /api/company/practice-answer
    if (qRes.data.questions.length > 0) {
      const qItem = qRes.data.questions[0];
      const practiceRes = await axios.post(`${BASE_URL}/company/practice-answer`, {
        questionId: qItem.id,
        answer: 'I would design YouTube by decoupling the video chunk ingestion layer from the transcoding workers using Apache Kafka. Chunks are converted into HLS/DASH adaptive bitrates and stored in distributed object storage with edge CDN points of presence.',
        confidence: 5,
        prepId: prepId
      }, authHeaders);
      console.log(`✅ POST /api/company/practice-answer: Quality: ${practiceRes.data.evaluation.quality}, Culture: ${practiceRes.data.evaluation.cultureAlignment}`);
    }

    console.log('\n🎉 ALL COMPANY PREP BACKEND TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

runTests();
