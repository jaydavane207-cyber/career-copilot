// backend/test-job-scraping.js
const http = require('http');
const express = require('express');
const app = require('./server');
const { sequelize } = require('./config/database');
const { User, Job, Skill, Resume } = require('./models');
const jwt = require('jsonwebtoken');
const env = require('./config/env');
const jobScraper = require('./utils/jobScraper');
const jobAnalyzer = require('./utils/jobAnalyzer');

async function runTests() {
  console.log('🚀 Starting Real Job Postings Integration Test Suite...\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // 1. UNIT TEST: Website Detection & URL Validation
  console.log('--- Test 1: URL Validation & Site Detection ---');
  assert(jobScraper.isValidURL('https://www.linkedin.com/jobs/view/123456'), 'Valid LinkedIn URL recognized');
  assert(jobScraper.isValidURL('https://indeed.com/viewjob?jk=abcdef'), 'Valid Indeed URL recognized');
  assert(!jobScraper.isValidURL('not-a-valid-url'), 'Invalid string recognized as invalid URL');
  assert(jobScraper.detectJobWebsite('https://www.linkedin.com/jobs/view/12345') === 'linkedin', 'LinkedIn website detected');
  assert(jobScraper.detectJobWebsite('https://www.indeed.com/viewjob?jk=123') === 'indeed', 'Indeed website detected');
  assert(jobScraper.detectJobWebsite('https://www.glassdoor.com/job-listing/123') === 'glassdoor', 'Glassdoor website detected');

  // 2. UNIT TEST: Metadata Extraction from Mock HTML
  console.log('\n--- Test 2: HTML & JSON-LD Job Metadata Extraction ---');
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Senior Full Stack Engineer at Acme Corp | LinkedIn</title>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": "Senior Full Stack Engineer",
          "hiringOrganization": { "@type": "Organization", "name": "Acme Corp" },
          "jobLocation": { "@type": "Place", "address": { "addressLocality": "San Francisco", "addressRegion": "CA" } },
          "baseSalary": { "value": { "minValue": 140000, "maxValue": 185000, "unitText": "YEAR" } },
          "description": "<p>We are hiring a Senior Full Stack Engineer with 4+ years of experience. Must have: React, Node.js, SQL, and Docker. Preferred qualifications: Kubernetes, AWS, and TypeScript. Experience in System Design is required.</p>"
        }
        </script>
      </head>
      <body>
        <h1>Senior Full Stack Engineer</h1>
      </body>
    </html>
  `;

  const extracted = jobScraper.extractJobMetadata(sampleHtml, 'linkedin', 'https://linkedin.com/jobs/view/123');
  assert(extracted.jobTitle === 'Senior Full Stack Engineer', `Title extracted correctly: "${extracted.jobTitle}"`);
  assert(extracted.company === 'Acme Corp', `Company extracted correctly: "${extracted.company}"`);
  assert(extracted.salary.includes('140000'), `Salary extracted correctly: "${extracted.salary}"`);
  assert(extracted.jobDescription.includes('React'), 'Job description extracted from JSON-LD');

  // 3. UNIT TEST: Job Analyzer Requirements Extraction
  console.log('\n--- Test 3: Job Requirements & Skill Analysis ---');
  const jdText = `
    Job Title: Senior Full Stack Engineer
    Company: Acme Corp
    Location: Remote
    
    About the Role:
    We are seeking a Senior Software Engineer with 4+ years of industry experience.
    
    Required Qualifications / Must have:
    - 4+ years of hands-on experience with JavaScript, React, and Node.js
    - Strong database skills in SQL and PostgreSQL
    - Hands-on experience with Docker and REST APIs
    - Deep understanding of System Design and scalability
    
    Preferred Qualifications / Nice to have:
    - Experience with Kubernetes and AWS cloud infrastructure
    - Proficiency with TypeScript and GraphQL
  `;

  const requirements = jobAnalyzer.analyzeJobRequirements(jdText);
  assert(requirements.seniority === 'Senior', `Seniority correctly identified as: ${requirements.seniority}`);
  assert(requirements.experienceRequired === 4, `Required experience extracted: ${requirements.experienceRequired} years`);
  assert(requirements.requiredSkills.includes('React'), 'React detected in required skills');
  assert(requirements.requiredSkills.includes('Node.js'), 'Node.js detected in required skills');
  assert(requirements.requiredSkills.includes('SQL'), 'SQL detected in required skills');
  assert(requirements.preferredSkills.includes('Kubernetes') || requirements.requiredSkills.includes('Kubernetes'), 'Kubernetes extracted');
  assert(requirements.preferredSkills.includes('AWS') || requirements.requiredSkills.includes('AWS'), 'AWS extracted');

  // 4. UNIT TEST: Resume Comparison & Scoring
  console.log('\n--- Test 4: Resume Comparison & Match Scoring ---');
  const candidateSkills = [
    { skillName: 'React', userLevel: 85 },
    { skillName: 'Node.js', userLevel: 80 },
    { skillName: 'JavaScript', userLevel: 90 },
    { skillName: 'SQL', userLevel: 75 },
    { skillName: 'REST APIs', userLevel: 80 }
    // Candidate does NOT have Kubernetes or AWS
  ];

  const comparison = jobAnalyzer.compareResumeWithJob(candidateSkills, requirements, 'Experienced engineer with 4 years building web apps.', 4);
  assert(comparison.matchScore >= 50 && comparison.matchScore <= 100, `Match score calculated: ${comparison.matchScore}%`);
  assert(comparison.skillMatches.strong.includes('React'), 'React identified as strong match');
  assert(comparison.skillMatches.missing.includes('Kubernetes') || comparison.missingImportantSkills.includes('Kubernetes'), 'Kubernetes identified as missing skill');
  assert(comparison.matchLevel === 'Good Match' || comparison.matchLevel === 'Needs Preparation', `Match level categorized: ${comparison.matchLevel}`);

  // 5. UNIT TEST: Preparation Summary Generation
  console.log('\n--- Test 5: Preparation Roadmap Summary ---');
  const summary = jobAnalyzer.generateJobAnalysisSummary(comparison, {
    company: 'Acme Corp',
    jobTitle: 'Senior Full Stack Engineer',
    seniority: 'Senior'
  });
  assert(summary.summary.length > 20, 'Summary narrative generated');
  assert(summary.strengths.length > 0, `Strengths identified: ${summary.strengths.length}`);
  assert(summary.gaps.length > 0, `Gaps identified: ${summary.gaps.length}`);
  assert(summary.recommendedPrep.length > 0, `Preparation tasks generated: ${summary.recommendedPrep.length}`);

  // 6. INTEGRATION TEST: Full API Route Testing with Local Mock Server
  console.log('\n--- Test 6: End-to-End API Routes (/api/jobs/analyze, /analysis, /preparation) ---');
  await sequelize.sync();
  if (Job.syncColumns) await Job.syncColumns();

  // Create a mock job posting website HTTP server
  const mockSiteApp = express();
  mockSiteApp.get('/job/senior-sde-123', (req, res) => {
    res.send(sampleHtml);
  });
  const mockSiteServer = http.createServer(mockSiteApp);
  await new Promise(r => mockSiteServer.listen(0, r));
  const mockPort = mockSiteServer.address().port;
  const mockJobUrl = `http://localhost:${mockPort}/job/senior-sde-123`;

  // Start API server
  const apiServer = http.createServer(app);
  await new Promise(r => apiServer.listen(0, r));
  const apiPort = apiServer.address().port;
  const apiBase = `http://localhost:${apiPort}`;

  // Find or create user
  let testUser = await User.findOne({ where: { email: 'jobtest@career.com' } });
  if (!testUser) {
    testUser = await User.create({
      fullName: 'Job Scraping Tester',
      email: 'jobtest@career.com',
      password: 'Password123!',
      targetRole: 'Senior Full Stack Engineer',
      experienceLevel: 'Mid-Level'
    });
  }

  // Seed sample skill for test user
  await Skill.findOrCreate({
    where: { userId: testUser.id, skillName: 'React' },
    defaults: { userId: testUser.id, skillName: 'React', userLevel: 85 }
  });

  const token = jwt.sign(
    { userId: testUser.id, email: testUser.email, targetRole: testUser.targetRole },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Test POST /api/jobs/analyze with mock job URL
  const analyzeRes = await fetch(`${apiBase}/api/jobs/analyze`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ jobURL: mockJobUrl })
  });

  const analyzeData = await analyzeRes.json();
  assert(analyzeRes.status === 200, `POST /api/jobs/analyze returned 200 OK`);
  assert(analyzeData.success === true, 'Response marked success');
  assert(analyzeData.data.job.title === 'Senior Full Stack Engineer', `Scraped title verified: ${analyzeData.data.job.title}`);
  assert(analyzeData.data.job.company === 'Acme Corp', `Scraped company verified: ${analyzeData.data.data?.job?.company || analyzeData.data.job.company}`);
  assert(analyzeData.data.analysis.matchScore > 0, `Match score in response: ${analyzeData.data.analysis.matchScore}%`);
  const createdJobId = analyzeData.data.jobId;

  // Test Caching: Second request for same URL should return cached result
  const cacheRes = await fetch(`${apiBase}/api/jobs/analyze`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ jobURL: mockJobUrl })
  });
  const cacheData = await cacheRes.json();
  assert(cacheRes.status === 200, 'Second call returned 200 OK');
  assert(cacheData.data.analysis.fromCache === true, 'Second call served from 24h cache (fromCache: true)');

  // Test GET /api/jobs/:id/analysis
  const getAnalysisRes = await fetch(`${apiBase}/api/jobs/${createdJobId}/analysis`, {
    method: 'GET',
    headers: authHeaders
  });
  const getAnalysisData = await getAnalysisRes.json();
  assert(getAnalysisRes.status === 200, `GET /api/jobs/${createdJobId}/analysis returned 200 OK`);
  assert(getAnalysisData.analysis.matchScore !== undefined, 'Saved analysis retrieved from database');

  // Test GET /api/jobs/:id/preparation
  const prepRes = await fetch(`${apiBase}/api/jobs/${createdJobId}/preparation`, {
    method: 'GET',
    headers: authHeaders
  });
  const prepData = await prepRes.json();
  assert(prepRes.status === 200, `GET /api/jobs/${createdJobId}/preparation returned 200 OK`);
  assert(prepData.data.mockInterviews.length > 0, 'Preparation roadmap includes mock interviews');
  assert(prepData.data.estimatedDays > 0, `Preparation time estimated: ${prepData.data.estimatedDays} days`);

  // Test Error Handling: Invalid URL
  const errRes = await fetch(`${apiBase}/api/jobs/analyze`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ jobURL: 'not-a-valid-http-url' })
  });
  const errData = await errRes.json();
  assert(errRes.status === 400, 'Invalid URL correctly rejected with 400 Bad Request');
  assert(errData.error === 'INVALID_URL', 'Error code INVALID_URL received');

  // Cleanup servers & database
  await new Promise(r => mockSiteServer.close(r));
  await new Promise(r => apiServer.close(r));
  try {
    await sequelize.close();
  } catch (e) {}

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} / ${total} tests passed.`);
  console.log(`========================================\n`);

  if (passed === total) {
    console.log('🎉 All Real Job Postings Integration tests passed successfully!\n');
  } else {
    console.error('❌ Some tests failed.');
    process.exitCode = 1;
  }
}

runTests().catch(err => {
  console.error('Test Suite encountered an error:', err);
  process.exitCode = 1;
});
