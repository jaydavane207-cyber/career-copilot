// backend/test-analytics.js
const { testConnection, sequelize } = require('./config/database');
const {
  calculateApplicationFunnel,
  analyzeSkillPerformance,
  calculateStudyEffectiveness,
  calculatePreparationROI,
  analyzeSalaryTrends,
  compareToPlatformAverage,
  generateRecommendations,
  predictFutureOutcomes
} = require('./utils/analyticsCalculator');
const {
  getSkillDemandMarket,
  getMarketSalaryData,
  getPlatformAverages
} = require('./utils/analyticsQueries');
const { User } = require('./models');

const runTest = async () => {
  console.log('🧪 Starting Career Analytics Dashboard Verification...');

  try {
    await testConnection();
    await sequelize.sync({ alter: false });
    const { syncColumns } = require('./models/Analytics');
    await syncColumns();
    console.log('✅ Analytics database tables initialized.');

    // Find or test with a dummy user
    let user = await User.findOne();
    const userId = user ? user.id : '00000000-0000-0000-0000-000000000000';
    console.log(`👤 Using User ID: ${userId}`);

    // Test 1: Application Funnel
    console.log('\n📊 [1/8] Testing calculateApplicationFunnel...');
    const funnel = await calculateApplicationFunnel(userId);
    console.log('Funnel:', JSON.stringify(funnel, null, 2));
    if (!funnel.funnel || !funnel.conversion_rates) throw new Error('Funnel calculation failed');
    console.log('✅ Funnel calculation passed.');

    // Test 2: Skill Performance
    console.log('\n🎯 [2/8] Testing analyzeSkillPerformance...');
    const skills = await analyzeSkillPerformance(userId);
    console.log(`Top Skill: ${skills.top_skill}, Weakest: ${skills.weakest_skill}`);
    console.log(`Analyzed ${skills.skills.length} skills.`);
    console.log('✅ Skill performance analysis passed.');

    // Test 3: Study Effectiveness
    console.log('\n📚 [3/8] Testing calculateStudyEffectiveness...');
    const study = await calculateStudyEffectiveness(userId);
    console.log(`Study Hours: ${study.total_hours}, Readiness: ${study.current_readiness}%, Predicted Ready: ${study.predicted_ready_date}`);
    console.log('✅ Study effectiveness calculation passed.');

    // Test 4: Preparation ROI
    console.log('\n💰 [4/8] Testing calculatePreparationROI...');
    const roi = await calculatePreparationROI(userId);
    console.log(`Best ROI Skill: ${roi.best_roi_skill}, Total Salary Impact: $${roi.total_estimated_salary_impact}`);
    console.log('✅ Preparation ROI calculation passed.');

    // Test 5: Salary Trends
    console.log('\n📈 [5/8] Testing analyzeSalaryTrends...');
    const salary = await analyzeSalaryTrends(userId);
    console.log(`Offers: ${salary.total_offers}, Final Avg: $${salary.avg_final_offer}, Negotiation: +${salary.negotiation_percentage}%`);
    console.log('✅ Salary trends calculation passed.');

    // Test 6: Platform Comparison
    console.log('\n⚖️ [6/8] Testing compareToPlatformAverage...');
    const compare = await compareToPlatformAverage(userId);
    console.log('Comparison metrics keys:', Object.keys(compare));
    console.log('✅ Platform comparison passed.');

    // Test 7: Recommendations & Predictions
    console.log('\n💡 [7/8] Testing Recommendations & Predictions...');
    const recs = await generateRecommendations(userId);
    const preds = await predictFutureOutcomes(userId);
    console.log(`Generated ${recs.length} recommendations. Priority 1: ${recs[0].title}`);
    console.log(`3-month expected offers: ${preds.projections_3_months.expected_offers}`);
    console.log('✅ Recommendations & Predictions passed.');

    // Test 8: Market Queries
    console.log('\n🌐 [8/8] Testing Market Queries...');
    const marketSkills = await getSkillDemandMarket(5);
    const marketSalary = await getMarketSalaryData('Senior SDE', 'Mountain View');
    const platformAvg = await getPlatformAverages();
    console.log(`Top market skill: ${marketSkills[0].skill} (${marketSkills[0].job_count} jobs)`);
    console.log(`Senior SDE Median: $${marketSalary.percentile_50}`);
    console.log(`Platform Avg Offer Rate: ${platformAvg.avg_offer_rate}%`);
    console.log('✅ Market queries passed.');

    console.log('\n🎉 ALL BACKEND ANALYTICS TESTS PASSED SUCCESSFULLY! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('❌ Analytics test failed:', err);
    process.exit(1);
  }
};

runTest();
