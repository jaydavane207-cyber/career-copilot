// backend/seeds/seedCompanies.js
/**
 * Seeder script to populate Company Interview Prep data:
 * - companies
 * - company_interview_questions
 * - company_salary_data
 * - company_success_stories
 * - company_interview_processes
 * - company_reviews
 * - company_culture_values
 */

const {
  sequelize,
  Company,
  CompanyInterviewQuestion,
  CompanySalaryData,
  CompanySuccessStory,
  CompanyInterviewProcess,
  CompanyReview,
  CompanyCultureValue
} = require('../models');

const companiesData = require('./companies.json');
const questionsData = require('./companyInterviewQuestions.json');
const salaryData = require('./companySalaryData.json');
const successStoriesData = require('./companySuccessStories.json');
const processesData = require('./companyInterviewProcesses.json');
const reviewsData = require('./companyReviews.json');
const cultureValuesData = require('./companyCultureValues.json');

async function seedCompanyData() {
  console.log('🌱 Seeding Company-Specific Interview Prep Data...');

  await sequelize.sync();

  // 1. Companies
  console.log(`🏢 Seeding ${companiesData.length} companies...`);
  for (const c of companiesData) {
    await Company.upsert({
      id: c.id,
      name: c.name,
      logo_url: c.logo_url,
      logoUrl: c.logo_url,
      website: c.website,
      headquarters: c.headquarters,
      founded_year: c.founded_year,
      foundedYear: c.founded_year,
      employee_count: c.employee_count,
      employeeCount: c.employee_count,
      industry: c.industry,
      description: c.description,
      culture_summary: c.culture_summary,
      cultureSummary: c.culture_summary,
      interview_difficulty: c.interview_difficulty,
      interviewDifficulty: c.interview_difficulty,
      average_interview_rounds: c.average_interview_rounds,
      averageInterviewRounds: c.average_interview_rounds,
      average_interview_duration: c.average_interview_duration,
      averageInterviewDuration: c.average_interview_duration,
      featured: c.featured || false
    });
  }

  // 2. Questions
  console.log(`❓ Seeding ${questionsData.length} interview questions...`);
  await CompanyInterviewQuestion.destroy({ where: {} });
  const batchSize = 100;
  for (let i = 0; i < questionsData.length; i += batchSize) {
    const chunk = questionsData.slice(i, i + batchSize).map(q => ({
      id: q.id,
      company_id: q.companyId,
      companyId: q.companyId,
      role: q.role,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      frequency: q.frequency,
      sample_answer: q.sample_answer,
      sampleAnswer: q.sample_answer,
      tips: q.tips,
      follow_up_questions: q.follow_up_questions,
      followUpQuestions: q.follow_up_questions,
      source: q.source,
      submitted_by_user: q.submitted_by_user,
      submittedByUser: q.submitted_by_user,
      helpful_count: q.helpful_count,
      helpfulCount: q.helpful_count
    }));
    await CompanyInterviewQuestion.bulkCreate(chunk);
  }

  // 3. Salary Data
  console.log(`💰 Seeding ${salaryData.length} salary records...`);
  await CompanySalaryData.destroy({ where: {} });
  for (let i = 0; i < salaryData.length; i += batchSize) {
    const chunk = salaryData.slice(i, i + batchSize).map(s => ({
      id: s.id,
      company_id: s.companyId,
      companyId: s.companyId,
      role: s.role,
      location: s.location,
      salary_low: s.salary_low,
      salary_high: s.salary_high,
      salary_average: s.salary_average,
      bonus_low: s.bonus_low,
      bonus_high: s.bonus_high,
      bonus_average: s.bonus_average,
      equity_low: s.equity_low,
      equity_high: s.equity_high,
      total_comp_low: s.total_comp_low,
      total_comp_high: s.total_comp_high,
      total_comp_average: s.total_comp_average,
      data_points: s.data_points,
      last_updated: s.last_updated
    }));
    await CompanySalaryData.bulkCreate(chunk);
  }

  // 4. Success Stories
  console.log(`🏆 Seeding ${successStoriesData.length} success stories...`);
  await CompanySuccessStory.destroy({ where: {} });
  for (let i = 0; i < successStoriesData.length; i += batchSize) {
    const chunk = successStoriesData.slice(i, i + batchSize).map(st => ({
      id: st.id,
      company_id: st.companyId,
      companyId: st.companyId,
      role: st.role,
      experience_level: st.experience_level,
      years_experience: st.years_experience,
      interview_duration: st.interview_duration,
      preparation_weeks: st.preparation_weeks,
      interview_rounds: st.interview_rounds,
      key_preparation: st.key_preparation,
      tips_for_success: st.tips_for_success,
      story: st.story,
      salary_negotiated: st.salary_negotiated,
      offer_accepted: st.offer_accepted,
      rating: st.rating
    }));
    await CompanySuccessStory.bulkCreate(chunk);
  }

  // 5. Interview Processes
  console.log(`📋 Seeding ${processesData.length} interview processes...`);
  await CompanyInterviewProcess.destroy({ where: {} });
  for (let i = 0; i < processesData.length; i += batchSize) {
    const chunk = processesData.slice(i, i + batchSize).map(p => ({
      id: p.id,
      company_id: p.companyId,
      companyId: p.companyId,
      role: p.role,
      round_number: p.round_number,
      round_name: p.round_name,
      duration_minutes: p.duration_minutes,
      interviewer_count: p.interviewer_count,
      focus_areas: p.focus_areas,
      tips: p.tips,
      rejection_rate: p.rejection_rate
    }));
    await CompanyInterviewProcess.bulkCreate(chunk);
  }

  // 6. Reviews
  console.log(`⭐ Seeding ${reviewsData.length} reviews...`);
  await CompanyReview.destroy({ where: {} });
  for (let i = 0; i < reviewsData.length; i += batchSize) {
    const chunk = reviewsData.slice(i, i + batchSize).map(r => ({
      id: r.id,
      company_id: r.companyId,
      companyId: r.companyId,
      role: r.role,
      employment_status: r.employment_status,
      years_at_company: r.years_at_company,
      rating: r.rating,
      pros: r.pros,
      cons: r.cons,
      work_life_balance: r.work_life_balance,
      culture_rating: r.culture_rating,
      management_rating: r.management_rating,
      compensation_rating: r.compensation_rating
    }));
    await CompanyReview.bulkCreate(chunk);
  }

  // 7. Culture Values
  console.log(`💡 Seeding ${cultureValuesData.length} culture values...`);
  await CompanyCultureValue.destroy({ where: {} });
  for (let i = 0; i < cultureValuesData.length; i += batchSize) {
    const chunk = cultureValuesData.slice(i, i + batchSize).map(cv => ({
      id: cv.id,
      company_id: cv.companyId,
      companyId: cv.companyId,
      value: cv.value,
      description: cv.description,
      how_its_tested: cv.how_its_tested,
      importance: cv.importance
    }));
    await CompanyCultureValue.bulkCreate(chunk);
  }

  console.log('✅ Company Interview Prep database seeding completed!');
}

if (require.main === module) {
  seedCompanyData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedCompanyData };
