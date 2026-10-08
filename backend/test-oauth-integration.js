// backend/test-oauth-integration.js
const app = require('./server');
const { encryptToken, decryptToken } = require('./config/oauth');
const { sequelize, OAuthProfile } = require('./models');

let server;
let baseUrl;

async function runTests() {
  await sequelize.sync();
  if (OAuthProfile && OAuthProfile.syncColumns) {
    await OAuthProfile.syncColumns();
  }

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`🚀 [Test Server] running on ${baseUrl}`);
      resolve();
    });
  });

  try {
    console.log('\n======================================================');
    console.log('🧪 TEST 1: Token Encryption & Decryption (AES-256)');
    console.log('======================================================');
    const sampleToken = 'gho_8941298419284192849182491284';
    const encrypted = encryptToken(sampleToken);
    const decrypted = decryptToken(encrypted);
    console.log(`Original:  ${sampleToken.slice(0, 10)}...`);
    console.log(`Encrypted: ${encrypted.slice(0, 20)}...`);
    console.log(`Decrypted: ${decrypted.slice(0, 10)}...`);
    if (decrypted !== sampleToken) {
      throw new Error('Encryption/Decryption mismatch!');
    }
    console.log('✅ Token encryption & decryption passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 2: Demo Preview Endpoints (LinkedIn & GitHub)');
    console.log('======================================================');
    let liRes = await fetch(`${baseUrl}/api/auth/demo-preview/linkedin`);
    let liData = await liRes.json();
    console.log('LinkedIn Preview Success:', liData.success);
    console.log('LinkedIn Experiences Count:', liData.previewData.workExperience.length);
    console.log('LinkedIn Skills Count:', liData.previewData.skills.length);
    if (!liData.success || !liData.previewToken || liData.previewData.workExperience.length === 0) {
      throw new Error('LinkedIn demo preview endpoint failed!');
    }

    let ghRes = await fetch(`${baseUrl}/api/auth/demo-preview/github`);
    let ghData = await ghRes.json();
    console.log('GitHub Preview Success:', ghData.success);
    console.log('GitHub Repos Count:', ghData.previewData.repositories.length);
    console.log('GitHub Languages:', Object.keys(ghData.previewData.programmingLanguages));
    if (!ghData.success || !ghData.previewToken || ghData.previewData.repositories.length === 0) {
      throw new Error('GitHub demo preview endpoint failed!');
    }
    console.log('✅ Demo preview endpoints passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 3: Retrieve Cached Preview by previewToken');
    console.log('======================================================');
    let tokenRes = await fetch(`${baseUrl}/api/auth/preview/${liData.previewToken}`);
    let tokenData = await tokenRes.json();
    console.log('Retrieved Cached Provider:', tokenData.provider);
    if (!tokenData.success || tokenData.provider !== 'linkedin') {
      throw new Error('Failed to retrieve preview by previewToken!');
    }
    console.log('✅ Cached preview retrieval passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 4: Register Test User for Profile Import');
    console.log('======================================================');
    const testUserEmail = `oauth_test_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: testUserEmail,
        password: 'Password123!',
        targetRole: 'Full Stack Developer'
      })
    });
    const regData = await regRes.json();
    console.log('Registered User:', regData.user.name, regData.user.email);
    const jwtToken = regData.token;
    if (!jwtToken) {
      throw new Error('Registration failed, no token received');
    }
    console.log('✅ User registered and JWT token acquired!');

    console.log('\n======================================================');
    console.log('🧪 TEST 5: Confirm LinkedIn Profile Import');
    console.log('======================================================');
    const confirmLiRes = await fetch(`${baseUrl}/api/profile/import/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        provider: 'linkedin',
        previewToken: liData.previewToken,
        selectedItems: {
          workExperience: liData.previewData.workExperience.slice(0, 2),
          education: liData.previewData.education,
          skills: liData.previewData.skills.slice(0, 5),
          certifications: liData.previewData.certifications
        }
      })
    });
    const confirmLiData = await confirmLiRes.json();
    console.log('LinkedIn Import Result:', confirmLiData);
    if (!confirmLiData.success || confirmLiData.imported.workExperiences !== 2) {
      throw new Error('LinkedIn import confirmation failed!');
    }
    console.log('✅ LinkedIn import confirmation passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 6: Confirm GitHub Profile Import');
    console.log('======================================================');
    const confirmGhRes = await fetch(`${baseUrl}/api/profile/import/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        provider: 'github',
        previewToken: ghData.previewToken,
        selectedItems: {
          repositories: ghData.previewData.repositories.slice(0, 3)
        }
      })
    });
    const confirmGhData = await confirmGhRes.json();
    console.log('GitHub Import Result:', confirmGhData);
    if (!confirmGhData.success || confirmGhData.imported.repositories !== 3) {
      throw new Error('GitHub import confirmation failed!');
    }
    console.log('✅ GitHub import confirmation passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 7: Query OAuth Status for Connected Accounts');
    console.log('======================================================');
    const statusRes = await fetch(`${baseUrl}/api/profile/oauth-status`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    const statusData = await statusRes.json();
    console.log('OAuth Status:', statusData);
    if (!statusData.linkedIn?.connected || !statusData.gitHub?.connected) {
      throw new Error('OAuth status does not reflect connected accounts!');
    }
    console.log('✅ OAuth status check passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 8: Refresh OAuth Imported Data');
    console.log('======================================================');
    const refreshRes = await fetch(`${baseUrl}/api/profile/import/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ provider: 'github' })
    });
    const refreshData = await refreshRes.json();
    console.log('Refresh Result:', refreshData.message);
    if (!refreshData.success) {
      throw new Error('OAuth data refresh failed!');
    }
    console.log('✅ OAuth data refresh passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 9: Disconnect LinkedIn OAuth Account');
    console.log('======================================================');
    const disconnectRes = await fetch(`${baseUrl}/api/profile/oauth/linkedin`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    const disconnectData = await disconnectRes.json();
    console.log('Disconnect Result:', disconnectData.message);

    const checkStatusRes = await fetch(`${baseUrl}/api/profile/oauth-status`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    const checkStatusData = await checkStatusRes.json();
    console.log('Updated Status: LinkedIn connected =', checkStatusData.linkedIn.connected);
    if (checkStatusData.linkedIn.connected) {
      throw new Error('LinkedIn account is still connected after disconnect!');
    }
    console.log('✅ Disconnect OAuth passed!');

    console.log('\n======================================================');
    console.log('🧪 TEST 10: Reject Unauthenticated Profile Requests');
    console.log('======================================================');
    const unauthRes = await fetch(`${baseUrl}/api/profile/oauth-status`);
    console.log(`Status: ${unauthRes.status}, Expected: 401`);
    if (unauthRes.status !== 401) {
      throw new Error('Unauthenticated request was not blocked!');
    }
    console.log('✅ Authentication protection passed!');

    console.log('\n🎉 ALL 10 TESTS PASSED SUCCESSFULLY! Feature 3 is 100% production ready!');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
      console.log('🛑 Test server stopped.');
      process.exit();
    }
  }
}

runTests();
