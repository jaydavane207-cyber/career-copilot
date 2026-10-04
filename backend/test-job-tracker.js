// backend/test-job-tracker.js
const axios = require('axios');
const app = require('./server');
const http = require('http');

let server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('🚀 Starting Job Application Tracker Backend Verification Tests...');
  let token = '';
  let createdJobId = '';

  try {
    // 1. Start test server
    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        resolve();
      });
    });

    // 2. Login as demo user
    console.log('\n--- TEST 1: Authenticate Demo User ---');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'demo@careercopilot.io',
      password: 'password123'
    });
    console.log('Login status:', loginRes.status, 'Success:', loginRes.data.success);
    token = loginRes.data.token;
    if (!token) throw new Error('Failed to obtain JWT token');

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 3. GET /api/jobs/stats
    console.log('\n--- TEST 2: GET /api/jobs/stats ---');
    const statsRes = await axios.get(`${BASE_URL}/jobs/stats`, authHeaders);
    console.log('Stats Response:', JSON.stringify(statsRes.data.stats, null, 2));
    if (statsRes.data.stats.totalApplications === undefined) {
      throw new Error('Stats endpoint missing totalApplications');
    }

    // 4. POST /api/jobs (Add new job application)
    console.log('\n--- TEST 3: POST /api/jobs (Create new application) ---');
    const newJobPayload = {
      companyName: 'Google',
      jobTitle: 'Software Engineer III, Infrastructure',
      jobLink: 'https://careers.google.com/jobs/results/123456',
      stage: 'applied',
      dateApplied: '2026-10-02',
      notes: 'Applied via employee referral from college alumni network.',
      salary: '₹55 LPA'
    };
    const createRes = await axios.post(`${BASE_URL}/jobs`, newJobPayload, authHeaders);
    console.log('Create Job status:', createRes.status, 'Success:', createRes.data.success);
    console.log('Created Job:', JSON.stringify(createRes.data.job, null, 2));
    createdJobId = createRes.data.job.id;

    if (!createdJobId) throw new Error('Job ID not returned after creation');
    if (createRes.data.job.companyName !== 'Google') throw new Error('Company name mismatch');
    if (createRes.data.job.stage !== 'applied') throw new Error('Stage mismatch');

    // 5. GET /api/jobs
    console.log('\n--- TEST 4: GET /api/jobs (Fetch all user jobs) ---');
    const getJobsRes = await axios.get(`${BASE_URL}/jobs`, authHeaders);
    console.log(`Fetched ${getJobsRes.data.count} jobs`);
    const foundCreated = getJobsRes.data.jobs.find(j => j.id === createdJobId);
    if (!foundCreated) throw new Error('Newly created job not found in GET /api/jobs');

    // 6. PUT /api/jobs/:id (Move to Interview stage and update fields)
    console.log('\n--- TEST 5: PUT /api/jobs/:id (Advance stage to interview) ---');
    const updateRes = await axios.put(`${BASE_URL}/jobs/${createdJobId}`, {
      stage: 'interview',
      interviewDate: '2026-10-12',
      notes: 'Recruiter reached out! Round 1 scheduled for Oct 12 with Staff Engineer.'
    }, authHeaders);
    console.log('Update status:', updateRes.status, 'Stage updated to:', updateRes.data.job.stage);
    if (updateRes.data.job.stage !== 'interview') throw new Error('Stage not updated to interview');
    if (updateRes.data.job.interviewDate !== '2026-10-12') throw new Error('interviewDate mismatch');

    // 7. PUT /api/jobs/:id (Move to Offer stage)
    console.log('\n--- TEST 6: PUT /api/jobs/:id (Advance stage to offer) ---');
    const offerUpdateRes = await axios.put(`${BASE_URL}/jobs/${createdJobId}`, {
      stage: 'offer',
      salary: '₹60 LPA + ₹15 Lakhs equity'
    }, authHeaders);
    console.log('Offer Update status:', offerUpdateRes.status, 'Stage updated to:', offerUpdateRes.data.job.stage);
    if (offerUpdateRes.data.job.stage !== 'offer') throw new Error('Stage not updated to offer');

    // 8. Re-check GET /api/jobs/stats
    console.log('\n--- TEST 7: Re-check GET /api/jobs/stats ---');
    const updatedStatsRes = await axios.get(`${BASE_URL}/jobs/stats`, authHeaders);
    console.log('Updated Stats:', JSON.stringify(updatedStatsRes.data.stats, null, 2));

    // 9. Input Validation Tests
    console.log('\n--- TEST 8: Input Validation (Missing companyName) ---');
    try {
      await axios.post(`${BASE_URL}/jobs`, {
        jobTitle: 'DevOps Engineer'
      }, authHeaders);
      throw new Error('Should have failed with 400 for missing companyName');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('Correctly rejected with 400:', err.response.data.message);
      } else {
        throw err;
      }
    }

    console.log('\n--- TEST 9: Input Validation (Invalid Stage) ---');
    try {
      await axios.post(`${BASE_URL}/jobs`, {
        companyName: 'Acme Corp',
        jobTitle: 'Product Manager',
        stage: 'invalid_stage_xyz'
      }, authHeaders);
      throw new Error('Should have failed with 400 for invalid stage');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('Correctly rejected with 400:', err.response.data.message);
      } else {
        throw err;
      }
    }

    // 10. DELETE /api/jobs/:id
    console.log('\n--- TEST 10: DELETE /api/jobs/:id ---');
    const deleteRes = await axios.delete(`${BASE_URL}/jobs/${createdJobId}`, authHeaders);
    console.log('Delete status:', deleteRes.status, 'Message:', deleteRes.data.message);

    // Verify deletion
    const finalJobsRes = await axios.get(`${BASE_URL}/jobs`, authHeaders);
    const stillExists = finalJobsRes.data.jobs.some(j => j.id === createdJobId);
    if (stillExists) throw new Error('Deleted job still exists in jobs list');
    console.log('Confirmed job was successfully removed from database.');

    console.log('\n✅ ALL BACKEND TESTS PASSED SUCCESSFULLY! 🎯');
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
