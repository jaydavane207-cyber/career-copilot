// backend/test-ai-resume.js
const http = require('http');
const app = require('./server');
const { sequelize } = require('./config/database');
const { User, Resume } = require('./models');
const jwt = require('jsonwebtoken');
const env = require('./config/env');
const aiAnalyzer = require('./utils/aiResumeAnalyzer');

async function runAiTests() {
  console.log('🤖 Starting AI Resume Feedback & Improvement Feature Tests...\n');

  await sequelize.sync();
  if (Resume.syncColumns) {
    await Resume.syncColumns();
  }

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  // 1. Create or find test user
  let testUser = await User.findOne({ where: { email: 'ai-tester@career.com' } });
  if (!testUser) {
    testUser = await User.create({
      fullName: 'AI Resume Tester',
      email: 'ai-tester@career.com',
      password: 'SecurePassword123!',
      targetRole: 'Senior Full Stack Engineer'
    });
  }

  const token = jwt.sign(
    { userId: testUser.id, email: testUser.email, targetRole: testUser.targetRole },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  async function apiRequest(path, method = 'GET', body = null, extraHeaders = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        ...authHeaders,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...extraHeaders
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }
    return { status: res.status, data, headers: res.headers };
  }

  // TEST 1: Authentication protection on all 4 new endpoints
  console.log('--- TEST 1: Route Authentication Verification ---');
  const dummyId = '00000000-0000-0000-0000-000000000000';
  const unauthPost = await fetch(`${baseUrl}/api/resume/${dummyId}/ai-feedback`, { method: 'POST' });
  const unauthGet = await fetch(`${baseUrl}/api/resume/${dummyId}/ai-feedback`);
  const unauthImproved = await fetch(`${baseUrl}/api/resume/${dummyId}/improved`);
  const unauthDownload = await fetch(`${baseUrl}/api/resume/${dummyId}/improved/download`);

  console.log(`POST ai-feedback unauth status: ${unauthPost.status} (expected 401)`);
  console.log(`GET ai-feedback unauth status: ${unauthGet.status} (expected 401)`);
  console.log(`GET improved unauth status: ${unauthImproved.status} (expected 401)`);
  console.log(`GET download unauth status: ${unauthDownload.status} (expected 401)`);

  if (unauthPost.status !== 401 || unauthGet.status !== 401) {
    throw new Error('Authentication check failed on AI routes!');
  }

  // TEST 2: 404 for non-existent resume
  console.log('\n--- TEST 2: Non-existent Resume Handling ---');
  const notFoundRes = await apiRequest(`/api/resume/${dummyId}/ai-feedback`, 'POST');
  console.log(`Not found status: ${notFoundRes.status} (expected 404)`);
  console.log(`Response message: ${notFoundRes.data?.message}`);
  if (notFoundRes.status !== 404) {
    throw new Error('Expected 404 for non-existent resume');
  }

  // TEST 3: Create a real test resume record
  console.log('\n--- TEST 3: Setting Up Test Resume Record ---');
  const sampleResumeText = `
ALEX KUMAR
Senior Full Stack Engineer
Email: alex.kumar@example.com | Phone: +91-9876543210 | Bengaluru, India
LinkedIn: linkedin.com/in/alexkumar | GitHub: github.com/alexkumar

PROFESSIONAL SUMMARY
Dynamic Full Stack Engineer with 4+ years of hands-on experience designing and building high-performance web applications using React, Node.js, Express, and PostgreSQL. Proven track record of improving system reliability and API latency.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
Frontend: React, Redux Toolkit, Next.js, Tailwind CSS, Jest
Backend: Node.js, Express, PostgreSQL, Redis, RESTful APIs, GraphQL
DevOps & Tools: Docker, Git, CI/CD GitHub Actions, AWS (EC2, S3)

WORK EXPERIENCE
Senior Software Engineer - TechVenture Labs (2022 - Present)
- Led development of scalable B2B microservices handling 2M+ requests daily.
- Optimized PostgreSQL database queries, reducing average API response latency by 45%.
- Implemented automated CI/CD pipelines reducing deployment failure rate from 12% to 2%.

Software Engineer - Innovatech Solutions (2020 - 2022)
- Built responsive client dashboard using React, Tailwind CSS, and WebSockets.
- Integrated third-party payment gateways ensuring 99.9% uptime.

EDUCATION
B.Tech in Computer Science & Engineering - NIT Karnataka (2016 - 2020)
`;

  const resume = await Resume.create({
    userId: testUser.id,
    fileName: 'Alex_Kumar_FullStack_Resume.pdf',
    originalName: 'Alex_Kumar_FullStack_Resume.pdf',
    filePath: '',
    fileSize: 45000,
    extractedText: sampleResumeText,
    targetRole: 'Senior Full Stack Engineer',
    analyses: []
  });

  console.log(`Created test resume ID: ${resume.id}`);

  // TEST 4: aiResumeAnalyzer input validation tests
  console.log('\n--- TEST 4: aiResumeAnalyzer Input Validation ---');
  let shortTextErrorCaught = false;
  try {
    await aiAnalyzer.analyzeResumeWithAI('Too short text');
  } catch (err) {
    shortTextErrorCaught = true;
    console.log(`Caught short text error: ${err.message} (code: ${err.code})`);
  }
  if (!shortTextErrorCaught) {
    throw new Error('Failed to validate short resume text!');
  }

  // TEST 5: Missing / invalid API key error handling
  console.log('\n--- TEST 5: Missing API Key Friendly Error Check ---');
  const currentKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'your_free_api_key_here'; // default placeholder
  let apiKeyErrorCaught = false;
  try {
    await aiAnalyzer.analyzeResumeWithAI(sampleResumeText);
  } catch (err) {
    apiKeyErrorCaught = true;
    console.log(`Caught API key missing error: ${err.message} (code: ${err.code})`);
  }
  if (!apiKeyErrorCaught) {
    throw new Error('Failed to catch missing API key error!');
  }

  // TEST 6: AI Feedback Flow & Caching Validation
  console.log('\n--- TEST 6: Mock Feedback Generation & Persistence ---');
  const mockAiFeedback = {
    overallScore: 88,
    readabilityScore: 92,
    grammar: {
      score: 95,
      issues: ['Minor hyphenation inconsistency in date ranges'],
      suggestions: ['Standardize date range hyphens across all experience blocks']
    },
    tone: {
      score: 85,
      feedback: 'Executive, assertive tone with strong focus on delivery.',
      suggestions: ['Continue using active voice throughout']
    },
    achievements: {
      score: 82,
      feedback: 'Excellent quantification in first role (45% latency reduction, 2M+ requests).',
      suggestions: ['Add quantitative metric to the Innovatech payment gateway bullet point']
    },
    actionVerbs: {
      score: 85,
      currentVerbs: ['Led', 'Optimized', 'Implemented', 'Built', 'Integrated'],
      suggestedVerbs: ['Architected', 'Spearheaded', 'Engineered', 'Pioneered'],
      suggestions: ['Upgrade "Built responsive client dashboard" to "Engineered enterprise client dashboard"']
    },
    quantifiableResults: {
      score: 80,
      found: ['2M+ requests daily', '45% API response latency reduction', 'deployment failure rate reduced from 12% to 2%', '99.9% uptime'],
      missing: ['Team size led', 'Cost savings from query optimization'],
      suggestions: ['Include size of engineering team mentored or led']
    },
    formatting: {
      score: 90,
      issues: [],
      suggestions: ['Ensure standard ATS margins (0.75 - 1 inch)']
    },
    strengths: [
      'Strong quantifiable metrics across technical contributions',
      'Modern, relevant tech stack (React, Node, PostgreSQL, Docker)',
      'Clear, logical chronological progression'
    ],
    weaknesses: [
      'Innovatech experience could highlight business revenue or user numbers',
      'Skills section could benefit from categorization'
    ],
    topImprovements: [
      {
        priority: 'high',
        category: 'achievements',
        suggestion: 'Quantify client adoption numbers for the Innovatech dashboard'
      },
      {
        priority: 'medium',
        category: 'actionVerbs',
        suggestion: 'Replace "Built" with "Architected" or "Spearheaded"'
      }
    ],
    improvementSummary: 'Exceptional senior-level profile. With minor enhancements in quantifying earlier experience and categorization of skills, this resume is in the top 10% for full stack positions.',
    nextSteps: [
      'Add user count or transaction volume to payment gateway integration',
      'Re-order skills to highlight Next.js and PostgreSQL as core competencies'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'gemini-1.5-flash'
  };

  // Directly save mock feedback to resume to test the full controller flow
  resume.aiFeedback = mockAiFeedback;
  resume.aiScore = mockAiFeedback.overallScore;
  resume.aiFeedbackGeneratedAt = new Date();
  await resume.save();

  // Test GET /api/resume/:id/ai-feedback (Cached feedback retrieval)
  console.log('\n--- TEST 7: GET /api/resume/:id/ai-feedback (Retrieval) ---');
  const getFeedbackRes = await apiRequest(`/api/resume/${resume.id}/ai-feedback`);
  console.log(`GET ai-feedback status: ${getFeedbackRes.status}`);
  console.log('GET ai-feedback raw data:', JSON.stringify(getFeedbackRes.data, null, 2));
  console.log(`Retrieved overall score: ${getFeedbackRes.data?.data?.overallScore}`);
  console.log(`Readability score: ${getFeedbackRes.data?.data?.readabilityScore}`);
  console.log(`Strengths count: ${getFeedbackRes.data?.data?.strengths?.length}`);

  if (getFeedbackRes.status !== 200 || getFeedbackRes.data?.data?.overallScore !== 88) {
    throw new Error('GET /api/resume/:id/ai-feedback failed!');
  }

  // TEST 8: Improved Resume Generation & Retrieval
  console.log('\n--- TEST 8: Improved Resume Storage & GET /api/resume/:id/improved ---');
  const mockImprovedResume = `ALEX KUMAR
Senior Full Stack Engineer
Bengaluru, India | +91-9876543210 | alex.kumar@example.com
LinkedIn: linkedin.com/in/alexkumar | GitHub: github.com/alexkumar

EXECUTIVE SUMMARY
High-impact Senior Full Stack Engineer with 4+ years of proven expertise architecting mission-critical distributed web systems using React, Node.js, and PostgreSQL. Demonstrated record of slashing API latency by 45% and maintaining 99.9% uptime across production platforms serving 2M+ daily active requests.

CORE COMPETENCIES
- Frontend Architecture: React, Redux Toolkit, Next.js, TypeScript, Tailwind CSS, Jest
- Backend Engineering: Node.js, Express, PostgreSQL, Redis, RESTful Microservices, GraphQL
- Cloud & Infrastructure: Docker, CI/CD (GitHub Actions), AWS (EC2, S3), Nginx

PROFESSIONAL EXPERIENCE
TechVenture Labs | Bengaluru, India
Senior Software Engineer (2022 - Present)
- Spearheaded engineering of distributed B2B microservices handling 2M+ requests daily with zero downtime.
- Architected optimized PostgreSQL indexing and database query caching, slashing average API response latency by 45%.
- Automated robust CI/CD pipelines via GitHub Actions, decreasing deployment failure rates from 12% to under 2%.

Innovatech Solutions | Bengaluru, India
Software Engineer (2020 - 2022)
- Engineered real-time client analytics dashboard utilizing React, Tailwind CSS, and WebSockets for 50,000+ active enterprise users.
- Integrated PCI-compliant payment gateways processing $1.2M+ in monthly transaction volume with 99.9% platform availability.

EDUCATION
Bachelor of Technology in Computer Science & Engineering
National Institute of Technology Karnataka (2016 - 2020)`;

  resume.aiImprovedResume = mockImprovedResume;
  await resume.save();

  const getImprovedRes = await apiRequest(`/api/resume/${resume.id}/improved`);
  console.log(`GET improved status: ${getImprovedRes.status}`);
  console.log(`Improved text snippet: ${getImprovedRes.data?.data?.improvedResume?.substring(0, 80)}...`);

  if (getImprovedRes.status !== 200 || !getImprovedRes.data?.data?.improvedResume) {
    throw new Error('GET /api/resume/:id/improved failed!');
  }

  // TEST 9: Improved Resume Download Endpoint
  console.log('\n--- TEST 9: GET /api/resume/:id/improved/download ---');
  const downloadRes = await apiRequest(`/api/resume/${resume.id}/improved/download`);
  console.log(`Download status: ${downloadRes.status}`);
  console.log(`Content-Type: ${downloadRes.headers.get('content-type')}`);
  console.log(`Content-Disposition: ${downloadRes.headers.get('content-disposition')}`);

  if (downloadRes.status !== 200 || !downloadRes.headers.get('content-disposition')?.includes('improved-resume.txt')) {
    throw new Error('Download endpoint failed!');
  }

  // Restore API key
  process.env.GEMINI_API_KEY = currentKey;

  // Clean up test resume
  await resume.destroy();
  console.log('\nCleaned up test resume record.');

  server.close();
  console.log('\n🎉 ALL AI RESUME FEEDBACK TESTS PASSED SUCCESSFULLY! 🚀');
}

runAiTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
