// backend/test-subscription-monetization.js
const assert = require('assert');
const http = require('http');
const app = require('./server');
const { User, Subscription, sequelize } = require('./models');

let server;
let port;
let baseUrl;

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const postData = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (postData) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting Monetization & Freemium Architecture Tests...\n');

  try {
    // 1. Initialize DB sync
    await sequelize.sync({ alter: false });
    if (User.syncColumns) await User.syncColumns();
    if (Subscription.syncColumns) await Subscription.syncColumns();

    // 2. Start server on ephemeral port
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
    console.log(`📡 Test server listening at ${baseUrl}\n`);

    // 3. Test Public Plans Endpoint
    console.log('▶️ [Test 1] GET /api/subscription/plans');
    const plansRes = await request('GET', '/api/subscription/plans');
    assert.strictEqual(plansRes.status, 200, 'Plans endpoint should return 200');
    assert.strictEqual(plansRes.body.success, true);
    assert.strictEqual(Array.isArray(plansRes.body.plans), true, 'Plans should be an array');
    assert.strictEqual(plansRes.body.plans.length >= 3, true, 'Should include free, premium, and pro plans');
    const freePlan = plansRes.body.plans.find((p) => p.id === 'free');
    const premiumPlan = plansRes.body.plans.find((p) => p.id === 'premium');
    const proPlan = plansRes.body.plans.find((p) => p.id === 'pro');
    assert.ok(freePlan, 'Free plan exists');
    assert.ok(premiumPlan, 'Premium plan exists');
    assert.ok(proPlan, 'Pro plan exists');
    assert.strictEqual(premiumPlan.priceINR.monthly, 799);
    assert.strictEqual(proPlan.priceINR.monthly, 1999);
    console.log('✅ Passed: Plans returned correctly with pricing and feature lists.\n');

    // 4. Create Test User and Log In
    console.log('▶️ [Test 2] User Registration & Initial Free Tier Status');
    const testEmail = `test_monetization_${Date.now()}@careercopilot.io`;
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Freemium Tester',
      email: testEmail,
      password: 'password123',
      targetRole: 'SDE-1'
    });
    assert.strictEqual(regRes.status, 201, 'User should be created');
    const userToken = regRes.body.token;
    assert.ok(userToken, 'Token received');
    assert.strictEqual(regRes.body.user.subscriptionTier, 'free', 'New user should start on free tier');

    const statusRes = await request('GET', '/api/subscription/status', null, userToken);
    assert.strictEqual(statusRes.status, 200, 'Status endpoint should return 200');
    assert.strictEqual(statusRes.body.tier, 'free');
    assert.strictEqual(statusRes.body.canPerform.resumeScan, true);
    assert.strictEqual(statusRes.body.canPerform.salaryNegotiation, false);
    console.log('✅ Passed: New user initialized on Free Tier with correct limits.\n');

    // 5. Test Pro-Tier Gating on Free User
    console.log('▶️ [Test 3] Gated Endpoint Rejection for Free User');
    const gatedRes = await request('GET', '/api/subscription/pro-features/salary-coach', null, userToken);
    assert.strictEqual(gatedRes.status, 403, 'Free user should be blocked from Pro features');
    assert.strictEqual(gatedRes.body.error, 'PAYMENT_REQUIRED');
    assert.strictEqual(gatedRes.body.requiredTier, 'pro');
    console.log('✅ Passed: Pro feature properly blocked for free tier user with 403 PAYMENT_REQUIRED.\n');

    // 6. Test Create Checkout Order
    console.log('▶️ [Test 4] POST /api/subscription/create-order');
    const orderRes = await request('POST', '/api/subscription/create-order', {
      planId: 'pro',
      billingCycle: 'yearly',
      currency: 'INR',
      gateway: 'razorpay'
    }, userToken);
    assert.strictEqual(orderRes.status, 200, 'Order creation should succeed');
    assert.strictEqual(orderRes.body.success, true);
    assert.ok(orderRes.body.order.orderId.startsWith('order_razorpay_'));
    assert.strictEqual(orderRes.body.order.planId, 'pro');
    assert.strictEqual(orderRes.body.order.billingCycle, 'yearly');
    assert.strictEqual(orderRes.body.order.displayAmount, 19990);
    console.log('✅ Passed: Checkout order generated with correct pricing & gateway info.\n');

    // 7. Test Verify Payment and Elevate Tier
    console.log('▶️ [Test 5] POST /api/subscription/verify-payment & Tier Elevation');
    const verifyRes = await request('POST', '/api/subscription/verify-payment', {
      orderId: orderRes.body.order.orderId,
      paymentId: 'pay_test_verified_123',
      signature: 'mock_valid_signature',
      planId: 'pro',
      billingCycle: 'yearly',
      currency: 'INR',
      gateway: 'razorpay'
    }, userToken);
    assert.strictEqual(verifyRes.status, 200, 'Payment verification should succeed');
    assert.strictEqual(verifyRes.body.success, true);
    assert.strictEqual(verifyRes.body.user.subscriptionTier, 'pro');
    assert.strictEqual(verifyRes.body.user.subscriptionStatus, 'active');
    console.log('✅ Passed: User upgraded to PRO tier and subscription record stored.\n');

    // 8. Test Pro-Tier Gating Now Unlocked
    console.log('▶️ [Test 6] Pro Feature Access After Upgrade');
    const unlockedRes = await request('GET', '/api/subscription/pro-features/salary-coach', null, userToken);
    assert.strictEqual(unlockedRes.status, 200, 'Upgraded Pro user should access feature');
    assert.strictEqual(unlockedRes.body.success, true);
    assert.ok(unlockedRes.body.data.negotiationGuide, 'Negotiation guide returned');
    console.log('✅ Passed: Upgraded Pro user successfully accesses premium salary coaching.\n');

    // 9. Test Subscription Status Now Reflects Active Pro Tier
    console.log('▶️ [Test 7] GET /api/subscription/status as Pro');
    const updatedStatusRes = await request('GET', '/api/subscription/status', null, userToken);
    assert.strictEqual(updatedStatusRes.status, 200);
    assert.strictEqual(updatedStatusRes.body.tier, 'pro');
    assert.strictEqual(updatedStatusRes.body.isPro, true);
    assert.strictEqual(updatedStatusRes.body.canPerform.salaryNegotiation, true);
    assert.strictEqual(updatedStatusRes.body.remaining.resumeScans, 'Unlimited');
    console.log('✅ Passed: Subscription status confirms unlimited quotas and Pro entitlements.\n');

    // 10. Test Subscription Cancellation (No Renewal)
    console.log('▶️ [Test 8] POST /api/subscription/cancel');
    const cancelRes = await request('POST', '/api/subscription/cancel', {}, userToken);
    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.body.success, true);
    console.log('✅ Passed: Subscription marked as cancelAtPeriodEnd successfully.\n');

    console.log('🎉 All 8 Monetization & Freemium tests PASSED successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
};

runTests();
