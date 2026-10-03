// backend/test-resume-feature.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('./server');
const { sequelize } = require('./config/database');
const { User, Resume } = require('./models');
const jwt = require('jsonwebtoken');
const env = require('./config/env');

async function runTests() {
  console.log('🚀 Starting Resume Analyzer Backend Test Suite...\n');

  // Ensure DB is synchronized
  await sequelize.sync();

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`📡 Test server running at ${baseUrl}`);

  // Create or find a test user
  let testUser = await User.findOne({ where: { email: 'resumetest@career.com' } });
  if (!testUser) {
    testUser = await User.create({
      fullName: 'Resume Tester',
      email: 'resumetest@career.com',
      password: 'Password123!',
      targetRole: 'Fullstack Developer'
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

  // Helper for json fetch
  async function makeRequest(urlPath, method = 'GET', body = null, headers = {}) {
    const res = await fetch(`${baseUrl}${urlPath}`, {
      method,
      headers: {
        ...authHeaders,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  // 1. Create a minimal valid PDF test file
  const samplePdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 190 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Alex Kumar) Tj\n0 -20 Td\n(Email: alex@example.com | Phone: 9876543210) Tj\n0 -20 Td\n(Experience) Tj\n0 -20 Td\n(Full Stack Engineer at StartupX. Built APIs using Node.js and SQL.) Tj\n0 -20 Td\n(Education) Tj\n0 -20 Td\n(B.Tech in Computer Science) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n457\n%%EOF';

  const testPdfPath = path.join(__dirname, 'test_resume_sample.pdf');
  fs.writeFileSync(testPdfPath, samplePdfContent);

  // Helper for multipart upload
  async function uploadFile(filePath, fieldName = 'resume', filename = 'test_resume_sample.pdf', mimeType = 'application/pdf') {
    const fileBytes = fs.readFileSync(filePath);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let bodyBuffer = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
      fileBytes,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const res = await fetch(`${baseUrl}/api/resume/upload`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: bodyBuffer
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  console.log('--- TEST 1: POST /api/resume/upload (Valid PDF with pdfjs-dist) ---');
  const uploadRes = await uploadFile(testPdfPath);
  console.log('Upload status:', uploadRes.status);
  console.log('Upload response:', {
    success: uploadRes.data?.success,
    resumeId: uploadRes.data?.resumeId,
    extractedSnippet: uploadRes.data?.extractedText?.slice(0, 80)
  });
  if (uploadRes.status !== 201 || !uploadRes.data?.extractedText) {
    throw new Error('Upload valid PDF failed');
  }
  const uploadedResumeId = uploadRes.data.resumeId;

  console.log('\n--- TEST 2: POST /api/resume/upload (Invalid non-PDF file) ---');
  const dummyTxtPath = path.join(__dirname, 'test_invalid.txt');
  fs.writeFileSync(dummyTxtPath, 'This is a text file, not a PDF.');
  const badUploadRes = await uploadFile(dummyTxtPath, 'resume', 'test_invalid.txt', 'text/plain');
  console.log('Invalid file status:', badUploadRes.status);
  console.log('Invalid file message:', badUploadRes.data?.message);
  if (badUploadRes.status !== 400) {
    throw new Error('Invalid file format check did not reject non-PDF');
  }
  fs.unlinkSync(dummyTxtPath);

  console.log('\n--- TEST 3: POST /api/resume/analyze (Resume Text + Job Description) ---');
  const jdText = `We are looking for a Senior Full Stack Engineer.
  Must have strong expertise in React, Docker, AWS, Node.js, and SQL.
  Experience with Kubernetes and CI/CD pipelines is a plus.`;

  const analyzeRes = await makeRequest('/api/resume/analyze', 'POST', {
    resumeId: uploadedResumeId,
    jobDescription: jdText,
    jobTitle: 'Senior Full Stack Engineer'
  });

  console.log('Analyze status:', analyzeRes.status);
  console.log('Match score:', analyzeRes.data?.matchScore);
  console.log('Missing keywords:', analyzeRes.data?.missingKeywords);
  console.log('Matching keywords:', analyzeRes.data?.matchingKeywords);
  console.log('Suggestions:', analyzeRes.data?.suggestions);
  console.log('ATS Readiness:', analyzeRes.data?.atsReadiness);

  if (analyzeRes.status !== 200 || typeof analyzeRes.data?.matchScore !== 'number') {
    throw new Error('Analyze endpoint failed');
  }
  if (!Array.isArray(analyzeRes.data?.missingKeywords) || !Array.isArray(analyzeRes.data?.suggestions)) {
    throw new Error('Invalid output format in analyze response');
  }
  if (!analyzeRes.data?.atsReadiness || typeof analyzeRes.data?.atsReadiness.hasContactInfo !== 'boolean') {
    throw new Error('ATS readiness format missing');
  }

  console.log('\n--- TEST 4: GET /api/resume/history ---');
  const historyRes = await makeRequest('/api/resume/history');
  console.log('History status:', historyRes.status);
  console.log('History count:', historyRes.data?.history?.length);
  console.log('First history item:', {
    fileName: historyRes.data?.history?.[0]?.fileName,
    jobTitle: historyRes.data?.history?.[0]?.jobTitle,
    matchScore: historyRes.data?.history?.[0]?.matchScore,
    missingKeywords: historyRes.data?.history?.[0]?.missingKeywords,
    analyzedAt: historyRes.data?.history?.[0]?.analyzedAt
  });
  if (historyRes.status !== 200 || !historyRes.data?.history?.length) {
    throw new Error('History endpoint failed');
  }

  console.log('\n--- TEST 5: Verify Resume Model Schema (userId, fileName, uploadedAt, analyses[]) ---');
  const resumeInDb = await Resume.findByPk(uploadedResumeId);
  console.log('Resume model check:');
  console.log('- userId exists:', !!resumeInDb.userId);
  console.log('- fileName:', resumeInDb.fileName);
  console.log('- uploadedAt:', resumeInDb.uploadedAt);
  console.log('- analyses is array:', Array.isArray(resumeInDb.analyses));
  console.log('- analyses count:', resumeInDb.analyses.length);

  if (!resumeInDb.uploadedAt || !Array.isArray(resumeInDb.analyses) || resumeInDb.analyses.length === 0) {
    throw new Error('Resume model does not satisfy required fields');
  }

  // Cleanup
  if (fs.existsSync(testPdfPath)) fs.unlinkSync(testPdfPath);
  console.log('\n🎉 ALL RESUME ANALYZER BACKEND TESTS PASSED SUCCESSFULLY! 🚀');
  server.close(() => {
    process.exit(0);
  });
}

runTests().catch(err => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});
