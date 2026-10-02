// backend/test-auth-profile.js
const app = require('./server');
const http = require('http');

let server;
let baseUrl;

async function runTests() {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server running on ${baseUrl}`);
      resolve();
    });
  });

  try {
    console.log('\n--- 1. Testing Password Validation (< 8 chars) ---');
    let res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arjun Sharma',
        email: 'arjun@example.com',
        password: 'short'
      })
    });
    let data = await res.json();
    console.log(`Status: ${res.status}, Expected: 400`);
    console.log('Response:', data);
    if (res.status !== 400 || !data.message.includes('8 characters')) {
      throw new Error('Password min 8 chars validation failed!');
    }

    console.log('\n--- 2. Testing Email Validation ---');
    res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arjun Sharma',
        email: 'invalid-email-format',
        password: 'SecurePassword123'
      })
    });
    data = await res.json();
    console.log(`Status: ${res.status}, Expected: 400`);
    console.log('Response:', data);
    if (res.status !== 400 || !data.message.toLowerCase().includes('email')) {
      throw new Error('Email format validation failed!');
    }

    console.log('\n--- 3. Testing Valid User Registration ---');
    const testEmail = `arjun_${Date.now()}@testindia.com`;
    res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arjun Sharma',
        email: testEmail,
        password: 'Password123!',
        targetRole: 'SDE-1 (Java & Spring Boot)'
      })
    });
    data = await res.json();
    console.log(`Status: ${res.status}, Expected: 201`);
    console.log('Response User:', data.user);
    if (res.status !== 201 || !data.token || !data.user.id || data.user.name !== 'Arjun Sharma') {
      throw new Error('Registration failed!');
    }
    const token = data.token;

    console.log('\n--- 4. Testing Duplicate Email Registration ---');
    res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Arjun',
        email: testEmail,
        password: 'Password123!'
      })
    });
    data = await res.json();
    console.log(`Status: ${res.status}, Expected: 409`);
    console.log('Response:', data);
    if (res.status !== 409) {
      throw new Error('Duplicate email check failed!');
    }

    console.log('\n--- 5. Testing Login with Bcrypt Password Verification ---');
    res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    data = await res.json();
    console.log(`Status: ${res.status}, Expected: 200`);
    console.log('Login User:', data.user?.name);
    if (res.status !== 200 || !data.token) {
      throw new Error('Login failed!');
    }

    console.log('\n--- 6. Testing GET /api/user (Profile Endpoint) ---');
    res = await fetch(`${baseUrl}/api/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    data = await res.json();
    console.log(`Status: ${res.status}, Expected: 200`);
    console.log('Profile retrieved:', data.user);
    if (res.status !== 200 || data.user.email !== testEmail || !data.user.createdAt) {
      throw new Error('GET /api/user failed!');
    }

    console.log('\n--- 7. Testing POST /api/user (Update Profile Endpoint) ---');
    res = await fetch(`${baseUrl}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Arjun S. Sharma',
        targetRole: 'Full Stack Tech Lead (MERN / System Design)'
      })
    });
    data = await res.json();
    console.log(`Status: ${res.status}, Expected: 200`);
    console.log('Updated Profile:', data.user);
    if (res.status !== 200 || data.user.name !== 'Arjun S. Sharma' || data.user.targetRole !== 'Full Stack Tech Lead (MERN / System Design)') {
      throw new Error('POST /api/user failed!');
    }

    console.log('\n🎉 ALL BACKEND AUTH & USER PROFILE TESTS PASSED PERFECTLY!\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
