// backend/test-analytics-api.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = require('./server');
const env = require('./config/env');
const { User, sequelize } = require('./models');

const runApiTest = async () => {
  console.log('🧪 Starting Analytics API Endpoints Verification...');

  try {
    await sequelize.authenticate();
    const server = app.listen(0, async () => {
      try {
        const port = server.address().port;
        console.log(`📡 Test server running on http://127.0.0.1:${port}`);

        let user = await User.findOne();
        if (!user) {
          user = await User.create({
            name: 'Analytics Tester',
            email: 'analytics_test@copilot.io',
            password: 'Password123!',
            targetRole: 'Senior SDE'
          });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          env.JWT_SECRET || 'career_copilot_secret_jwt_key_2024',
          { expiresIn: '1h' }
        );

        const client = axios.create({
          baseURL: `http://127.0.0.1:${port}/api/analytics`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 1. Dashboard
        console.log('🔍 [1/12] GET /dashboard');
        const dash = await client.get('/dashboard');
        console.log('  -> Status:', dash.status, '| Keys:', Object.keys(dash.data.data));

        // 2. Funnel
        console.log('🔍 [2/12] GET /funnel');
        const funnel = await client.get('/funnel');
        console.log('  -> Status:', funnel.status, '| Overall Offer Rate:', funnel.data.data.overall_offer_rate + '%');

        // 3. Skills
        console.log('🔍 [3/12] GET /skills?sort=weakest');
        const skills = await client.get('/skills?sort=weakest');
        console.log('  -> Status:', skills.status, '| First skill:', skills.data.data.skills[0].skill);

        // 4. Study
        console.log('🔍 [4/12] GET /study');
        const study = await client.get('/study');
        console.log('  -> Status:', study.status, '| Hours:', study.data.data.total_hours);

        // 5. Salary
        console.log('🔍 [5/12] GET /salary');
        const salary = await client.get('/salary');
        console.log('  -> Status:', salary.status, '| Final Avg:', '$' + salary.data.data.avg_final_offer);

        // 6. ROI
        console.log('🔍 [6/12] GET /roi');
        const roi = await client.get('/roi');
        console.log('  -> Status:', roi.status, '| Best ROI:', roi.data.data.best_roi_skill);

        // 7. Market Skills (Public)
        console.log('🔍 [7/12] GET /market/skills?limit=10');
        const marketSkills = await axios.get(`http://127.0.0.1:${port}/api/analytics/market/skills?limit=10`);
        console.log('  -> Status:', marketSkills.status, '| Count:', marketSkills.data.data.length);

        // 8. Market Salary (Public)
        console.log('🔍 [8/12] GET /market/salary?role=Senior SDE&location=Mountain View');
        const marketSalary = await axios.get(`http://127.0.0.1:${port}/api/analytics/market/salary?role=Senior SDE&location=Mountain View`);
        console.log('  -> Status:', marketSalary.status, '| Median:', '$' + marketSalary.data.data.percentile_50);

        // 9. Compare
        console.log('🔍 [9/12] GET /compare?metric=offer_rate');
        const compare = await client.get('/compare?metric=offer_rate');
        console.log('  -> Status:', compare.status, '| User:', compare.data.data.user_value);

        // 10. Recommendations
        console.log('🔍 [10/12] GET /recommendations');
        const recs = await client.get('/recommendations');
        console.log('  -> Status:', recs.status, '| Count:', recs.data.data.length);

        // 11. Predictions
        console.log('🔍 [11/12] GET /predictions');
        const preds = await client.get('/predictions');
        console.log('  -> Status:', preds.status, '| Expected 3M Offers:', preds.data.data.projections_3_months.expected_offers);

        // 12. Export
        console.log('🔍 [12/12] GET /export?format=pdf');
        const exp = await client.get('/export?format=pdf');
        console.log('  -> Status:', exp.status, '| File Name:', exp.data.file_name);

        console.log('\n🎉 ALL 12 API ENDPOINTS VERIFIED AND RESPONDING WITH 200 OK! 🎉');
        server.close(() => process.exit(0));
      } catch (err) {
        console.error('❌ API Test failed:', err.response?.data || err.message);
        server.close(() => process.exit(1));
      }
    });
  } catch (dbErr) {
    console.error('❌ DB connection failed:', dbErr.message);
    process.exit(1);
  }
};

runApiTest();
