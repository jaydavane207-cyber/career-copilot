// backend/utils/interviewAnswerAnalyzer.js
require('../config/env');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Helper to get an active GoogleGenerativeAI client
 */
const getGeminiClient = () => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_free_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Cleans markdown code blocks (```json ... ```) from Gemini AI response
 */
const cleanJsonResponse = (text) => {
  if (!text) return '{}';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

/**
 * Intelligent Fallback Analyzer
 * Produces structured heuristic feedback when Gemini is unavailable, offline, or rate limited.
 */
const generateHeuristicFeedback = (question, userAnswer, role, company) => {
  const answerText = (userAnswer || '').trim();
  const wordCount = answerText ? answerText.split(/\s+/).length : 0;
  const companyTarget = company || 'a top-tier tech company';
  const roleTarget = role || 'Software Engineer';

  // Keyword indicators
  const hasMetrics = /\d+%|\$\d+|\d+\s*(users|ms|seconds|minutes|hours|days|x|fold)/i.test(answerText);
  const hasStarStructure = /situation|task|action|result|initially|we solved|outcome|measured|impact/i.test(answerText);
  const hasTechDepth = /architecture|framework|component|api|database|scale|trade-off|latency|performance|design/i.test(answerText);
  const hasCollaboration = /team|collaborated|stakeholder|partnered|mentored|reviewed|cross-functional/i.test(answerText);

  let score = 55;
  const strengths = [];
  const improvements = [];
  const tags = [];

  if (wordCount >= 80) {
    score += 15;
    strengths.push('Good answer length that allows sufficient depth without trailing off.');
    tags.push('clarity');
  } else if (wordCount >= 40) {
    score += 8;
    strengths.push('Concise summary that addresses the prompt directly.');
  } else {
    improvements.push('Answer is somewhat brief; provide richer context and concrete examples.');
  }

  if (hasMetrics) {
    score += 12;
    strengths.push('Quantified business or performance impact with concrete figures.');
    tags.push('technical_depth');
  } else {
    improvements.push('Include measurable metrics (e.g., % latency drop, team time saved, user growth) to validate your impact.');
  }

  if (hasStarStructure) {
    score += 10;
    strengths.push('Clear storytelling progression moving from initial challenge to positive resolution.');
    tags.push('structure');
  } else {
    improvements.push('Adopt the STAR method explicitly: Situation, Task, Action you took, and final Result.');
  }

  if (hasTechDepth || hasCollaboration) {
    score += 8;
    strengths.push('Demonstrates relevant technical awareness and collaborative mindset aligned with ' + roleTarget + '.');
    tags.push('behavioral_depth');
  } else {
    improvements.push('Highlight specific engineering decisions, trade-offs, and lessons learned.');
  }

  // Ensure 3 strengths & 3 improvements
  if (strengths.length < 3) {
    strengths.push(`Direct alignment with typical expectations for ${roleTarget} interviews at ${companyTarget}.`);
  }
  if (strengths.length < 3) {
    strengths.push('Maintained a constructive, solution-oriented tone throughout.');
  }
  if (improvements.length < 3) {
    improvements.push('Anticipate interviewer follow-up questions regarding edge cases and scalability.');
  }

  const boundedScore = Math.min(95, Math.max(45, score));

  // Build suggested STAR improvement
  const suggestedBetterAnswer = `Situation: When working on a key project at my previous role, we faced a challenge closely aligned with this: "${question.slice(0, 80)}...".
Task: As a ${roleTarget}, my responsibility was to diagnose the root cause, establish a clear technical strategy, and execute the solution under tight deadlines.
Action: I analyzed the architectural constraints, proposed an incremental delivery plan, and collaborated across teams to implement key optimizations and best practices.
Result: The project shipped ahead of schedule, reducing overhead by ~35% and improving overall team velocity. Reflecting on this experience, it taught me how to balance architectural quality with pragmatic business delivery.`;

  return {
    score: boundedScore,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    suggestedBetterAnswer,
    tags: tags.length > 0 ? tags : ['structure', 'clarity'],
    feedbackSummary: `Solid response for a ${roleTarget} candidate with ${boundedScore}/100 readiness. Focusing on STAR quantification will elevate this to top percentile.`,
    isHeuristic: true
  };
};

/**
 * Analyze candidate answer to behavioral or technical interview questions
 * @param {string} question - Interview question text
 * @param {string} userAnswer - Candidate's written answer
 * @param {string} role - Candidate's target role (e.g. SDE-1, Frontend Developer)
 * @param {string} [company] - Target company name (e.g. Google, Amazon)
 * @returns {Promise<Object>} Feedback with score, strengths, improvements, suggestedBetterAnswer, tags
 */
const analyzeAnswer = async (question, userAnswer, role = 'Software Engineer', company = '') => {
  if (!question || typeof question !== 'string') {
    throw new Error('Question is required for answer analysis.');
  }
  if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.trim().length === 0) {
    throw new Error('Candidate answer cannot be empty.');
  }

  const roleName = role || 'Software Engineer';
  const companyName = company ? company.trim() : 'a top tech company';

  const genAI = getGeminiClient();
  if (!genAI) {
    console.info('ℹ️ [interviewAnswerAnalyzer] Gemini API key not found. Using structured heuristic analysis.');
    return generateHeuristicFeedback(question, userAnswer, roleName, companyName);
  }

  const prompt = `You are a Principal Engineering Leader and Senior Hiring Bar Raiser conducting interviews for a ${roleName} role at ${companyName}.
Evaluate the candidate's answer to the following interview question:

QUESTION:
"${question}"

CANDIDATE'S ANSWER:
"${userAnswer}"

Please evaluate this answer thoroughly according to tech industry hiring standards:
1. Score from 0 to 100 based on clarity, structure (STAR method for behavioral), technical depth, and impact demonstration.
2. Strengths: Exactly 3 concise, punchy bullet points highlighting what the candidate did well.
3. Improvements: Exactly 3 actionable bullet points explaining what would make this answer stand out more.
4. Suggested Better Answer: A polished, natural, high-scoring version of how a top candidate would answer this question (using STAR for behavioral or architecture/trade-offs for technical).
5. Tags: Select applicable tags from: ["clarity", "structure", "technical_depth", "behavioral_depth", "impact_metrics", "ownership"].
6. Feedback Summary: A 1-2 sentence overall assessment summary.

Return JSON ONLY matching this exact structure:
{
  "score": 85,
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2",
    "Improvement 3"
  ],
  "suggestedBetterAnswer": "...",
  "tags": ["clarity", "structure", "technical_depth"],
  "feedbackSummary": "..."
}`;

  // Candidate Gemini model fallback chain
  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-1.5-flash'
  ].filter(Boolean);

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200,
          responseMimeType: 'application/json'
        }
      });

      const response = await model.generateContent(prompt);
      const rawText = response.response.text();
      const cleaned = cleanJsonResponse(rawText);
      const parsed = JSON.parse(cleaned);

      if (parsed && typeof parsed.score === 'number') {
        return {
          score: Math.min(100, Math.max(0, Math.round(parsed.score))),
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 3) : [],
          suggestedBetterAnswer: parsed.suggestedBetterAnswer || '',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['clarity', 'structure'],
          feedbackSummary: parsed.feedbackSummary || 'Assessment completed successfully.',
          modelUsed: modelName,
          isHeuristic: false
        };
      }
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ [interviewAnswerAnalyzer] Model ${modelName} failed: ${err.message}. Trying next model...`);
    }
  }

  console.warn('⚠️ [interviewAnswerAnalyzer] All Gemini models failed or key quota exceeded. Falling back to heuristic evaluation.', lastError?.message);
  return generateHeuristicFeedback(question, userAnswer, roleName, companyName);
};

module.exports = {
  analyzeAnswer,
  generateHeuristicFeedback
};
