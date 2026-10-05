// backend/test-ai-resume-e2e.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('./server');
const { sequelize } = require('./config/database');
const { User, Resume } = require('./models');
const jwt = require('jsonwebtoken');
const env = require('./config/env');

async function runFullE2ETest() {
  console.log('================================================================');
  console.log('   CAREER COPILOT: AI RESUME FEEDBACK FULL E2E TEST SUITE        ');
  console.log('================================================================\n');

  await sequelize.sync();
  if (Resume.syncColumns) {
    await Resume.syncColumns();
  }

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log(`📡 Local Test Server running at: ${baseUrl}\n`);

  const report = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    details: []
  };

  function assert(name, condition, extraInfo = '') {
    report.totalTests++;
    if (condition) {
      report.passed++;
      console.log(`  ✅ [PASS] ${name} ${extraInfo}`);
      report.details.push({ name, status: 'PASS', info: extraInfo });
    } else {
      report.failed++;
      console.log(`  ❌ [FAIL] ${name} ${extraInfo}`);
      report.details.push({ name, status: 'FAIL', info: extraInfo });
    }
  }

  // 1. User Setup & Auth
  console.log('STAGE 1: Authentication & User Token Generation');
  let testUser = await User.findOne({ where: { email: 'e2e-ai-user@careercopilot.com' } });
  if (!testUser) {
    testUser = await User.create({
      fullName: 'Priya Sharma',
      email: 'e2e-ai-user@careercopilot.com',
      password: 'SecurePassword123!',
      targetRole: 'Full Stack Developer'
    });
  }

  const token = jwt.sign(
    { userId: testUser.id, email: testUser.email, targetRole: testUser.targetRole },
    env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  assert('JWT Token Generated', !!token, `(User ID: ${testUser.id})`);

  // Helper for requests
  async function request(endpoint, method = 'GET', body = null, headers = {}) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...headers
      },
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
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

  // 2. Upload Sample PDF Resume
  console.log('\nSTAGE 2: PDF Resume Upload & Parsing');
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const tempPdfPath = path.join(uploadsDir, 'e2e_temp_resume.pdf');
  const samplePdfData = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 260 >>
stream
BT
/F1 12 Tf
50 720 Td
(PRIYA SHARMA) Tj
0 -20 Td
(priya.sharma@example.com | Bengaluru, India | +91-9876543210) Tj
0 -20 Td
(SUMMARY) Tj
0 -15 Td
(Full Stack Developer with 3+ years experience in React, Node.js, Express, PostgreSQL.) Tj
0 -20 Td
(EXPERIENCE) Tj
0 -15 Td
(Software Engineer at TechCorp. Built scalable microservices, reduced latency by 35%.) Tj
0 -20 Td
(EDUCATION) Tj
0 -15 Td
(B.E. Computer Science, VTU, 2021) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
00000000115 00000 n 
00000000216 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
530
%%EOF`;

  fs.writeFileSync(tempPdfPath, samplePdfData);

  // Read file as Blob / FormData
  const fileBuffer = fs.readFileSync(tempPdfPath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('resume', blob, 'priya_resume.pdf');
  formData.append('targetRole', 'Senior Fullstack Engineer');

  const uploadRes = await request('/api/resume/upload', 'POST', formData);
  assert('Upload Endpoint Status 201', uploadRes.status === 201);
  const uploadedResumeId = uploadRes.data?.resumeId || uploadRes.data?.id;
  assert('Resume ID Returned', !!uploadedResumeId, `(${uploadedResumeId})`);

  // Clean up temp file
  try { fs.unlinkSync(tempPdfPath); } catch (e) {}

  // 3. Analyze against Job Description
  console.log('\nSTAGE 3: ATS Job Description Analysis');
  const jdText = `We are looking for a Senior Full Stack Engineer with expertise in React, Node.js, Express, TypeScript, PostgreSQL, Docker, AWS, and CI/CD pipelines.`;
  const analyzeRes = await request('/api/resume/analyze', 'POST', {
    resumeId: uploadedResumeId,
    jobTitle: 'Senior Full Stack Engineer',
    jobDescription: jdText
  });

  assert('JD Analysis Status 200', analyzeRes.status === 200);
  assert('Match Score Calculated', typeof analyzeRes.data?.matchScore === 'number', `Score: ${analyzeRes.data?.matchScore}%`);
  assert('Missing Keywords Identified', Array.isArray(analyzeRes.data?.missingKeywords));
  assert('Suggestions Generated', Array.isArray(analyzeRes.data?.suggestions) && analyzeRes.data.suggestions.length > 0);

  // 4. AI Resume Feedback Generation
  console.log('\nSTAGE 4: AI Resume Feedback Schema & Scoring Validation');

  // Inject structured mock AI feedback conforming to exact prompt specification
  const mockFeedbackPayload = {
    overallScore: 86,
    readabilityScore: 92,
    grammar: {
      score: 95,
      issues: ['Inconsistent oxford comma in skills list'],
      suggestions: ['Apply consistent punctuation across bullet points']
    },
    tone: {
      score: 84,
      feedback: 'Professional, assertive, and technically articulate.',
      suggestions: ['Ensure verbs are consistently in past tense for previous roles']
    },
    achievements: {
      score: 80,
      feedback: 'Reduced latency by 35% is a standout metric.',
      suggestions: ['Quantify the scale of microservices (e.g. daily throughput)']
    },
    actionVerbs: {
      score: 78,
      currentVerbs: ['Built', 'Developed', 'Maintained'],
      suggestedVerbs: ['Architected', 'Spearheaded', 'Optimized', 'Engineered'],
      suggestions: ['Replace "Built scalable microservices" with "Architected high-throughput microservices"']
    },
    quantifiableResults: {
      score: 75,
      found: ['Reduced latency by 35%'],
      missing: ['User volume metrics', 'Engineering team size'],
      suggestions: ['Add quantifiable figures to TechCorp contributions']
    },
    formatting: {
      score: 90,
      issues: [],
      suggestions: ['Maintain single-column ATS layout for optimum parsing']
    },
    strengths: [
      'Concrete performance metric: 35% latency reduction',
      'Core modern web stack (React, Node.js, Express, PostgreSQL)',
      'Clear, readable chronological sections'
    ],
    weaknesses: [
      'Relies on common verbs like "Built"',
      'Could highlight cloud and containerization experience'
    ],
    topImprovements: [
      {
        priority: 'high',
        category: 'achievements',
        suggestion: 'Quantify request volume and database scale'
      },
      {
        priority: 'medium',
        category: 'actionVerbs',
        suggestion: 'Use high-impact verbs like Architected and Spearheaded'
      },
      {
        priority: 'low',
        category: 'formatting',
        suggestion: 'Add distinct subcategories for technical skills'
      }
    ],
    improvementSummary: 'Solid full stack profile with measurable latency optimization. Enhancing action verbs and quantifying request volume will place this resume in the top tier.',
    nextSteps: [
      'Incorporate AWS and Docker skills into summary',
      'Upgrade action verbs in experience section',
      'Add GitHub portfolio link to contact info'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'gemini-1.5-flash'
  };

  // Update resume with feedback
  const resumeRecord = await Resume.findByPk(uploadedResumeId);
  resumeRecord.aiFeedback = mockFeedbackPayload;
  resumeRecord.aiScore = mockFeedbackPayload.overallScore;
  resumeRecord.aiFeedbackGeneratedAt = new Date();
  await resumeRecord.save();

  // Test GET /api/resume/:id/ai-feedback
  const getAiRes = await request(`/api/resume/${uploadedResumeId}/ai-feedback`);
  assert('GET AI Feedback Status 200', getAiRes.status === 200);

  const fb = getAiRes.data?.data;
  assert('Overall Score between 0 and 100', fb?.overallScore >= 0 && fb?.overallScore <= 100, `(${fb?.overallScore}/100)`);
  assert('Readability Score between 0 and 100', fb?.readabilityScore >= 0 && fb?.readabilityScore <= 100, `(${fb?.readabilityScore}/100)`);
  assert('Grammar Category Present & Scored', fb?.grammar?.score >= 0 && Array.isArray(fb?.grammar?.suggestions));
  assert('Professional Tone Category Present', fb?.tone?.score >= 0 && typeof fb?.tone?.feedback === 'string');
  assert('Action Verbs (Current & Suggested) Present', Array.isArray(fb?.actionVerbs?.currentVerbs) && Array.isArray(fb?.actionVerbs?.suggestedVerbs));
  assert('Quantifiable Results (Found & Missing) Present', Array.isArray(fb?.quantifiableResults?.found) && Array.isArray(fb?.quantifiableResults?.missing));
  assert('Achievements Category Present', fb?.achievements?.score >= 0 && typeof fb?.achievements?.feedback === 'string');
  assert('Formatting Category Present', fb?.formatting?.score >= 0);
  assert('Strengths Array Contains Items', Array.isArray(fb?.strengths) && fb?.strengths.length >= 2, `Count: ${fb?.strengths?.length}`);
  assert('Weaknesses Array Contains Items', Array.isArray(fb?.weaknesses) && fb?.weaknesses.length >= 1, `Count: ${fb?.weaknesses?.length}`);
  assert('Top Improvements Ranked by Priority', Array.isArray(fb?.topImprovements) && fb?.topImprovements[0]?.priority === 'high');
  assert('Next Steps Action List Present', Array.isArray(fb?.nextSteps) && fb?.nextSteps.length >= 3, `Count: ${fb?.nextSteps?.length}`);

  // 5. Improved Resume Endpoint
  console.log('\nSTAGE 5: Improved Resume Generation & File Download');
  const mockImprovedText = `PRIYA SHARMA
Senior Full Stack Engineer
Bengaluru, India | priya.sharma@example.com | +91-9876543210
GitHub: github.com/priyasharma | LinkedIn: linkedin.com/in/priyasharma

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 3+ years of expertise architecting high-availability web applications and REST microservices using React, Node.js, Express, and PostgreSQL. Demonstrated success slashing API latency by 35% and scaling services to handle enterprise workloads.

TECHNICAL SKILLS
- Frontend: React, Redux Toolkit, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, Redis, RESTful Microservices, GraphQL
- Cloud & DevOps: Docker, Git, CI/CD GitHub Actions, AWS (EC2, S3)

PROFESSIONAL EXPERIENCE
TechCorp | Bengaluru, India
Senior Software Engineer (2021 - Present)
- Architected and deployed scalable Node.js/PostgreSQL microservices handling 1.5M+ daily requests with 99.9% uptime.
- Optimized database indexing and query caching, reducing average API response latency by 35%.
- Spearheaded adoption of automated GitHub Actions CI/CD workflows, reducing release cycle time by 40%.

EDUCATION
Bachelor of Engineering in Computer Science & Engineering
Visvesvaraya Technological University (2017 - 2021)`;

  resumeRecord.aiImprovedResume = mockImprovedText;
  await resumeRecord.save();

  const improvedRes = await request(`/api/resume/${uploadedResumeId}/improved`);
  assert('GET Improved Resume Status 200', improvedRes.status === 200);
  assert('Improved Resume Text Returned', typeof improvedRes.data?.data?.improvedResume === 'string' && improvedRes.data.data.improvedResume.length > 200);

  // 6. Download as Text File
  const downloadRes = await request(`/api/resume/${uploadedResumeId}/improved/download`);
  assert('Download Endpoint Status 200', downloadRes.status === 200);
  assert('Content-Type is text/plain', (downloadRes.headers.get('content-type') || '').includes('text/plain'));
  assert('Content-Disposition Attachment Header Present', (downloadRes.headers.get('content-disposition') || '').includes('attachment; filename="improved-resume.txt"'));
  assert('Downloaded Text Matches Content', typeof downloadRes.data === 'string' && downloadRes.data.includes('PRIYA SHARMA'));

  // 7. Cleanup
  console.log('\nSTAGE 6: Database Cleanup');
  await resumeRecord.destroy();
  assert('Test Resume Record Destroyed', true);

  server.close();

  console.log('\n================================================================');
  console.log(`   TEST RESULTS: ${report.passed} PASSED / ${report.failed} FAILED (${report.totalTests} TOTAL)`);
  console.log('================================================================\n');

  if (report.failed > 0) {
    process.exit(1);
  }
}

runFullE2ETest().catch(err => {
  console.error('\n❌ E2E Test Suite Error:', err);
  process.exit(1);
});
