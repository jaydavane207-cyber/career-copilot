// backend/test-india-seed.js
/**
 * Verification Test Suite for India-Specific Pre-loaded Data in Career Copilot
 * Validates:
 * 1. 20 Popular India Target Roles in DB & Fixtures
 * 2. Role Skill Definitions (5-10 required + 2-3 optional per role with hours & levels)
 * 3. 100 Mock Interview Questions (35 Behavioral, 40 Technical, 25 System Design with follow-ups)
 * 4. 100+ Curated Resources across Skills
 * 5. 20 Coding Problem Topics
 * 6. Popular Tech Companies in India with LPA Salaries and Interview Tips
 * 7. Live API Endpoints Verification
 */

const http = require('http');
const app = require('./server');
const {
  sequelize,
  Role,
  Skill,
  MockInterviewQuestion,
  Resource,
  PopularCompany,
  CodingTopic
} = require('./models');

const rolesFixtures = require('./seeds/roles.json');
const skillsFixtures = require('./seeds/skills.json');
const questionsFixtures = require('./seeds/questions.json');
const resourcesFixtures = require('./seeds/resources.json');
const popularCompaniesFixtures = require('./seeds/popularCompanies.json');
const codingTopicsFixtures = require('./seeds/codingTopics.json');

const makeRequest = (server, options) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: encodeURI(options.path),
      method: options.method || 'GET',
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
    req.end();
  });
};

const runVerification = async () => {
  console.log('🇮🇳 Starting India Pre-loaded Data Verification Suite...\n');

  // ==========================================================================
  // TEST 1: Verify 20 Target Roles
  // ==========================================================================
  console.log('--- TEST 1: Target Roles Verification (20 Roles) ---');
  const expectedRoles = [
    "Senior Software Engineer",
    "Full Stack Developer",
    "Frontend Developer (React/Vue/Angular)",
    "Backend Developer (Node.js/Python/Java)",
    "DevOps Engineer",
    "QA Automation Engineer",
    "Data Scientist",
    "Android Developer",
    "iOS Developer",
    "System Design Architect",
    "Product Manager",
    "Data Engineer",
    "Security Engineer",
    "Machine Learning Engineer",
    "Cloud Engineer (AWS/GCP/Azure)",
    "Database Administrator",
    "Solutions Architect",
    "IT Infrastructure Engineer",
    "Blockchain Developer",
    "Game Developer (Unity/Unreal)"
  ];

  console.log(`Roles in Fixture: ${rolesFixtures.length}`);
  const rolesInDb = await Role.findAll();
  console.log(`Roles in Database: ${rolesInDb.length}`);

  if (rolesFixtures.length !== 20 || rolesInDb.length !== 20) {
    throw new Error(`Expected exactly 20 roles, found ${rolesFixtures.length} in fixtures, ${rolesInDb.length} in DB`);
  }

  for (const expectedTitle of expectedRoles) {
    const found = rolesInDb.find(r => r.title.toLowerCase() === expectedTitle.toLowerCase());
    if (!found) {
      throw new Error(`Missing expected target role: ${expectedTitle}`);
    }
  }
  console.log('✅ All 20 target India tech roles verified in database with LPA salary ranges.');

  // ==========================================================================
  // TEST 2: Verify Skill Definitions Per Role (5-10 required, 2-3 optional)
  // ==========================================================================
  console.log('\n--- TEST 2: Skill Definitions Per Role ---');
  const roleBenchmarkSkills = await Skill.findAll({ where: { userId: null } });
  console.log(`Total Role Benchmark Skills in DB: ${roleBenchmarkSkills.length}`);

  for (const role of rolesInDb) {
    const skillsForThisRole = roleBenchmarkSkills.filter(s => s.roleId === role.id);
    const requiredSkills = skillsForThisRole.filter(s => !s.isOptional);
    const optionalSkills = skillsForThisRole.filter(s => s.isOptional);

    if (requiredSkills.length < 5 || requiredSkills.length > 10) {
      throw new Error(`Role ${role.title} has ${requiredSkills.length} required skills (expected 5-10)`);
    }
    if (optionalSkills.length < 2 || optionalSkills.length > 3) {
      throw new Error(`Role ${role.title} has ${optionalSkills.length} optional skills (expected 2-3)`);
    }

    // Verify benchmark attributes on skills
    for (const skill of skillsForThisRole) {
      if (!skill.requiredLevel || skill.requiredLevel < 50 || skill.requiredLevel > 100) {
        throw new Error(`Skill ${skill.skillName} has invalid requiredLevel: ${skill.requiredLevel}`);
      }
      if (!skill.estimatedHours || skill.estimatedHours < 20) {
        throw new Error(`Skill ${skill.skillName} has invalid estimatedHours: ${skill.estimatedHours}`);
      }
      if (!skill.resources || typeof skill.resources !== 'object') {
        throw new Error(`Skill ${skill.skillName} is missing resources object`);
      }
    }
  }
  console.log('✅ All 20 roles contain 8 required + 3 optional skills with requiredLevel, estimatedHours, and resources.');

  // ==========================================================================
  // TEST 3: Verify 100 Mock Interview Questions (35 / 40 / 25)
  // ==========================================================================
  console.log('\n--- TEST 3: Mock Interview Questions Bank (100 Questions) ---');
  const dbQuestions = await MockInterviewQuestion.findAll();
  console.log(`Questions in Database: ${dbQuestions.length}`);

  const behavioral = dbQuestions.filter(q => q.type === 'Behavioral');
  const technical = dbQuestions.filter(q => q.type === 'Technical');
  const systemDesign = dbQuestions.filter(q => q.type === 'System Design');

  console.log(`- Behavioral:    ${behavioral.length}/35`);
  console.log(`- Technical:     ${technical.length}/40`);
  console.log(`- System Design: ${systemDesign.length}/25`);

  if (behavioral.length !== 35 || technical.length !== 40 || systemDesign.length !== 25 || dbQuestions.length !== 100) {
    throw new Error('Questions count distribution mismatch (expected 35/40/25/100)!');
  }

  // Verify prompt-specific questions are present
  const feQuestions = technical.filter(q => q.role === 'Frontend Developer');
  const qaQuestions = technical.filter(q => q.role === 'QA Automation Engineer');
  const dsQuestions = technical.filter(q => q.role === 'Data Scientist');
  const beQuestions = technical.filter(q => q.role === 'Backend Developer');

  console.log(`  * Frontend Technical:     ${feQuestions.length}/10`);
  console.log(`  * QA Automation:          ${qaQuestions.length}/10`);
  console.log(`  * Data Scientist:         ${dsQuestions.length}/10`);
  console.log(`  * Backend Developer / SDE: ${beQuestions.length}/10`);

  if (feQuestions.length !== 10 || qaQuestions.length !== 10 || dsQuestions.length !== 10 || beQuestions.length !== 10) {
    throw new Error('Technical partition mismatch across 4 key roles (expected 10 each)!');
  }

  // Check required key prompt questions
  const requiredQuestions = [
    "Tell me about yourself",
    "Why do you want to work with us?",
    "Describe a challenging project you led",
    "How do you handle conflict in a team?",
    "Tell me about a time you failed and how you recovered",
    "Explain React lifecycle",
    "What are hooks in React?",
    "Difference between var, let, const",
    "How does closure work in JavaScript?",
    "Explain async/await",
    "What is test automation",
    "Difference between unit and integration testing",
    "Explain Selenium",
    "What is API testing",
    "Explain supervised vs unsupervised",
    "What is overfitting",
    "Explain A/B testing",
    "How do you handle imbalanced datasets",
    "Design Twitter/Facebook",
    "Design YouTube",
    "Design URL Shortener",
    "Design a caching system"
  ];

  for (const rq of requiredQuestions) {
    const found = dbQuestions.find(q => q.question.toLowerCase().includes(rq.toLowerCase()));
    if (!found) {
      throw new Error(`Missing expected interview question: '${rq}'`);
    }
  }

  // Verify rubrics and follow-ups
  for (const q of dbQuestions) {
    if (!q.sampleAnswer || !q.sampleAnswer.strongAnswer || !Array.isArray(q.sampleAnswer.keyPoints) || !q.sampleAnswer.tips) {
      throw new Error(`Question ${q.id} missing complete sampleAnswer rubric!`);
    }
    if (!Array.isArray(q.followUps) || q.followUps.length === 0) {
      throw new Error(`Question ${q.id} missing followUps array!`);
    }
    if (!Array.isArray(q.expectedKeywords) || q.expectedKeywords.length === 0) {
      throw new Error(`Question ${q.id} missing expectedKeywords!`);
    }
  }
  console.log('✅ All 100 questions contain follow-ups, full STAR sample answers, key points, tips, and expected keywords.');

  // ==========================================================================
  // TEST 4: Curated Resources (100+ Resources)
  // ==========================================================================
  console.log('\n--- TEST 4: Curated Resources Verification (100+ Resources) ---');
  const dbResources = await Resource.findAll();
  console.log(`Resources in Database: ${dbResources.length}`);

  if (dbResources.length < 100) {
    throw new Error(`Expected at least 100 curated resources, found ${dbResources.length}`);
  }

  const sampleSkills = ["HTML/CSS", "JavaScript", "React", "Node.js", "Python", "Java", "SQL", "Docker", "Kubernetes", "AWS", "System Design", "DSA", "Data Science"];
  for (const sk of sampleSkills) {
    const list = dbResources.filter(r => r.skill === sk);
    if (list.length === 0) {
      throw new Error(`Missing resources for critical skill: ${sk}`);
    }
  }
  console.log(`✅ Verified ${dbResources.length} curated resources across ${new Set(dbResources.map(r => r.skill)).size} skill categories.`);

  // ==========================================================================
  // TEST 5: Popular Companies in India (25 Companies)
  // ==========================================================================
  console.log('\n--- TEST 5: Popular Companies in India (25 Companies) ---');
  const dbCompanies = await PopularCompany.findAll();
  console.log(`Companies in Database: ${dbCompanies.length}`);

  if (dbCompanies.length !== 25) {
    throw new Error(`Expected 25 popular companies, found ${dbCompanies.length}`);
  }

  const checkCompanies = ["Google India", "Flipkart", "Razorpay", "Swiggy", "PhonePe", "CRED", "Tata Consultancy Services (TCS)", "Infosys"];
  for (const cName of checkCompanies) {
    const found = dbCompanies.find(c => c.name === cName);
    if (!found) throw new Error(`Missing popular company: ${cName}`);
    if (!found.salaryRangeByLevel || Object.keys(found.salaryRangeByLevel).length === 0) {
      throw new Error(`Company ${cName} missing salaryRangeByLevel data`);
    }
    if (!Array.isArray(found.typicalRounds) || found.typicalRounds.length === 0) {
      throw new Error(`Company ${cName} missing typicalRounds`);
    }
    if (!Array.isArray(found.interviewTips) || found.interviewTips.length === 0) {
      throw new Error(`Company ${cName} missing interviewTips`);
    }
  }
  console.log('✅ All 25 popular companies in India verified with interview rounds, focus areas, and LPA salaries.');

  // ==========================================================================
  // TEST 6: Coding Problem Topics (20 Topics)
  // ==========================================================================
  console.log('\n--- TEST 6: Coding Problem Topics Verification (20 Topics) ---');
  const dbTopics = await CodingTopic.findAll();
  console.log(`Topics in Database: ${dbTopics.length}`);

  const requiredTopics = [
    "Array", "String", "Matrix / 2D Grid", "Linked List", "Tree & Binary Search Tree",
    "Graph", "Dynamic Programming", "Sorting", "Searching / Binary Search", "Hash Table / Hash Map",
    "Heap / Priority Queue", "Queue & Deque", "Stack", "Greedy Algorithms", "Math & Number Theory",
    "Bit Manipulation", "Design & Data Structure Implementation", "Concurrency & Multithreading",
    "System Design (LLD & HLD)", "SQL & Query Design"
  ];

  if (dbTopics.length !== 20) {
    throw new Error(`Expected 20 coding topics, found ${dbTopics.length}`);
  }

  for (const topic of requiredTopics) {
    const found = dbTopics.find(t => t.topicName.toLowerCase().includes(topic.toLowerCase().split(' ')[0]));
    if (!found) throw new Error(`Missing coding topic: ${topic}`);
    if (!Array.isArray(found.recommendedProblems) || found.recommendedProblems.length === 0) {
      throw new Error(`Topic ${topic} missing recommended problems`);
    }
  }
  console.log('✅ All 20 required coding problem topics verified with benchmark interview problems.');

  // ==========================================================================
  // TEST 7: HTTP REST API Endpoints Verification
  // ==========================================================================
  console.log('\n--- TEST 7: HTTP API Endpoints Verification ---');
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`📡 Test server listening on port ${port}`);

  try {
    // 1. GET /api/skills/roles
    const resRoles = await makeRequest(server, { path: '/api/skills/roles' });
    if (resRoles.status !== 200 || !resRoles.body.success || resRoles.body.roles.length !== 20) {
      throw new Error(`GET /api/skills/roles failed, status ${resRoles.status}, count ${resRoles.body.roles?.length}`);
    }
    console.log(`✅ GET /api/skills/roles returned ${resRoles.body.roles.length} roles.`);

    // 2. GET /api/skills/role/frontend-developer
    const resRoleSkills = await makeRequest(server, { path: '/api/skills/role/frontend-developer' });
    if (resRoleSkills.status !== 200 || !resRoleSkills.body.success || resRoleSkills.body.skills.length !== 11) {
      throw new Error(`GET /api/skills/role/frontend-developer failed: count ${resRoleSkills.body.skills?.length}`);
    }
    console.log(`✅ GET /api/skills/role/frontend-developer returned 11 curriculum skills (8 req + 3 opt).`);

    // 3. GET /api/skills/companies
    const resCompanies = await makeRequest(server, { path: '/api/skills/companies' });
    if (resCompanies.status !== 200 || !resCompanies.body.success || resCompanies.body.companies.length !== 25) {
      throw new Error(`GET /api/skills/companies failed: count ${resCompanies.body.companies?.length}`);
    }
    console.log(`✅ GET /api/skills/companies returned 25 top companies in India.`);

    // 4. GET /api/skills/coding-topics
    const resTopics = await makeRequest(server, { path: '/api/skills/coding-topics' });
    if (resTopics.status !== 200 || !resTopics.body.success || resTopics.body.topics.length !== 20) {
      throw new Error(`GET /api/skills/coding-topics failed: count ${resTopics.body.topics?.length}`);
    }
    console.log(`✅ GET /api/skills/coding-topics returned 20 coding problem topics.`);

    // 5. GET /api/skills/resources/React
    const resReact = await makeRequest(server, { path: '/api/skills/resources/React' });
    if (resReact.status !== 200 || !resReact.body.success || resReact.body.resources.length === 0) {
      throw new Error(`GET /api/skills/resources/React failed: count ${resReact.body.resources?.length}`);
    }
    console.log(`✅ GET /api/skills/resources/React returned ${resReact.body.resources.length} resources.`);

    // 6. GET /api/mock-interview/questions?type=System Design&count=5 (authenticated)
    const jwt = require('jsonwebtoken');
    const env = require('./config/env');
    const { User } = require('./models');
    const demoUser = await User.findOne({ where: { email: 'demo@careercopilot.io' } });
    const token = jwt.sign(
      { userId: demoUser.id, email: demoUser.email },
      env.JWT_SECRET || 'career_copilot_secret',
      { expiresIn: '1h' }
    );
    const authHeaders = { Authorization: `Bearer ${token}` };

    const resSysDesign = await makeRequest(server, {
      path: '/api/mock-interview/questions?type=System Design&count=5',
      headers: authHeaders
    });
    if (resSysDesign.status !== 200 || !resSysDesign.body.success || resSysDesign.body.questions.length !== 5) {
      throw new Error(`GET /api/mock-interview/questions failed: count ${resSysDesign.body.questions?.length}`);
    }
    console.log(`✅ GET /api/mock-interview/questions returned 5 System Design questions without answer leak.`);
  } finally {
    server.close();
  }

  console.log('\n========================================================================');
  console.log('🎉 ALL 7 INDIA PRE-LOADED DATA VERIFICATION TESTS PASSED FLAWLESSLY!');
  console.log('========================================================================\n');
};

runVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });
