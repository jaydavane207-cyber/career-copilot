// backend/utils/readinessCalculator.js
const { READINESS_WEIGHTS } = require('../config/constants');
const { Resume, Skill, CodingProblem, MockInterview } = require('../models');

const calculateReadinessScore = async (userId, targetRole = 'Fullstack Developer') => {
  // 1. Resume Score (Max 100)
  const latestResume = await Resume.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });
  const resumeScore = latestResume ? Math.min(100, Math.round(latestResume.atsScore || 60)) : 40;

  // 2. Skills Coverage Score (Max 100)
  const userSkills = await Skill.findAll({ where: { userId } });
  let skillsScore = 50;
  if (userSkills.length > 0) {
    const verifiedCount = userSkills.filter(s => s.isVerified || ['Advanced', 'Expert'].includes(s.proficiency)).length;
    skillsScore = Math.min(100, Math.round((userSkills.length * 8) + (verifiedCount * 10)));
  }

  // 3. Coding Problems Practice Score (Max 100)
  const codingCount = await CodingProblem.count({
    where: { userId, status: 'Solved' }
  });
  // Scale: 20 problems solved gives 100%
  const codingScore = Math.min(100, Math.round((codingCount / 20) * 100));

  // 4. Mock Interview Score (Max 100)
  const interviews = await MockInterview.findAll({
    where: { userId },
    order: [['completedAt', 'DESC']],
    limit: 5
  });
  let interviewScore = 55;
  if (interviews.length > 0) {
    const avgScore = interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / interviews.length;
    interviewScore = Math.round(avgScore);
  }

  // Weighted Readiness Score
  const totalReadiness = Math.round(
    (resumeScore * READINESS_WEIGHTS.RESUME) +
    (skillsScore * READINESS_WEIGHTS.SKILLS) +
    (codingScore * READINESS_WEIGHTS.CODING) +
    (interviewScore * READINESS_WEIGHTS.INTERVIEW)
  );

  return {
    totalReadiness,
    breakdown: {
      resume: {
        score: resumeScore,
        weight: READINESS_WEIGHTS.RESUME * 100,
        status: latestResume ? 'Analyzed' : 'No Resume Uploaded'
      },
      skills: {
        score: skillsScore,
        weight: READINESS_WEIGHTS.SKILLS * 100,
        totalLogged: userSkills.length
      },
      coding: {
        score: codingScore,
        weight: READINESS_WEIGHTS.CODING * 100,
        solvedProblems: codingCount
      },
      interview: {
        score: interviewScore,
        weight: READINESS_WEIGHTS.INTERVIEW * 100,
        sessionsCompleted: interviews.length
      }
    }
  };
};

module.exports = {
  calculateReadinessScore
};
