// backend/utils/keywordMatcher.js
const rolesData = require('../seeds/roles.json');

const analyzeResumeMatch = (resumeText = '', targetRoleName = 'Fullstack Developer') => {
  const normalizedText = (resumeText || '').toLowerCase();

  // Find target role definition
  const role = rolesData.find(
    r => r.title.toLowerCase() === (targetRoleName || '').toLowerCase()
  ) || rolesData.find(r => r.title === 'Fullstack Developer');

  const requiredSkills = role ? role.coreSkills : [
    'JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'Git', 'REST APIs', 'Docker'
  ];

  const matchedKeywords = [];
  const missingKeywords = [];

  for (const skill of requiredSkills) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(normalizedText)) {
      matchedKeywords.push(skill);
    } else {
      missingKeywords.push(skill);
    }
  }

  // Calculate ATS match percentage
  const matchRatio = requiredSkills.length > 0 ? (matchedKeywords.length / requiredSkills.length) : 0;
  const atsScore = Math.round(matchRatio * 100);

  // Generate suggestions
  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Consider incorporating key technologies required for ${role ? role.title : 'this role'}: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }

  const wordCount = normalizedText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    suggestions.push('Your resume appears brief. Add more quantitative achievements and project metrics.');
  } else if (wordCount > 1000) {
    suggestions.push('Your resume is lengthy. Ensure your most relevant accomplishments are on the first page.');
  }

  if (!normalizedText.includes('achieved') && !normalizedText.includes('improved') && !normalizedText.includes('developed')) {
    suggestions.push('Use strong action verbs such as "Engineered", "Optimized", "Architected", and "Delivered" to quantify your impact.');
  }

  return {
    targetRole: role ? role.title : targetRoleName,
    atsScore,
    totalRequired: requiredSkills.length,
    matchedCount: matchedKeywords.length,
    matchedKeywords,
    missingKeywords,
    suggestions
  };
};

module.exports = {
  analyzeResumeMatch
};
