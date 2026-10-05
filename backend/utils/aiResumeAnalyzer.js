// backend/utils/aiResumeAnalyzer.js
require('../config/env');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Helper to get an active GoogleGenerativeAI instance
 * Validates the API key before initializing
 * @returns {GoogleGenerativeAI}
 */
const getGeminiClient = () => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_free_api_key_here') {
    const error = new Error('Gemini API key is not configured. Please add a valid GEMINI_API_KEY to your backend/.env file.');
    error.code = 'API_KEY_MISSING';
    error.statusCode = 400;
    throw error;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Cleans markdown code blocks (e.g. ```json ... ```) from Gemini response
 * @param {string} text
 * @returns {string}
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
 * Handles and normalizes Gemini API errors into user-friendly messages
 * @param {Error} error
 * @returns {Error}
 */
const normalizeAiError = (error) => {
  const message = error.message || '';
  console.error('❌ [aiResumeAnalyzer] Error:', message);

  if (error.code === 'API_KEY_MISSING' || error.code === 'INVALID_RESUME_TEXT') {
    return error;
  }

  // Rate limiting (free tier: 15 RPM)
  if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.toLowerCase().includes('quota')) {
    const rateErr = new Error('Gemini API rate limit reached (free tier allows up to 15 requests/minute). Please wait a moment and try again.');
    rateErr.code = 'RATE_LIMIT_EXCEEDED';
    rateErr.statusCode = 429;
    return rateErr;
  }

  // Invalid API key
  if (message.includes('API key not valid') || message.includes('API_KEY_INVALID') || message.includes('403')) {
    const authErr = new Error('Invalid Gemini API key provided. Please verify your GEMINI_API_KEY in backend/.env.');
    authErr.code = 'INVALID_API_KEY';
    authErr.statusCode = 401;
    return authErr;
  }

  // Generic AI failure
  const genericErr = new Error(`AI Resume analysis failed: ${message}`);
  genericErr.code = 'AI_SERVICE_ERROR';
  genericErr.statusCode = 500;
  return genericErr;
};

/**
 * Analyze resume text using Google Gemini API
 * @param {string} resumeText - Raw text extracted from resume PDF
 * @returns {Promise<object>} Structured resume feedback object
 */
/**
 * Calls Gemini with an intelligent candidate model fallback chain
 * Automatically tries available models if the primary is busy (503) or deprecated (404)
 * @param {GoogleGenerativeAI} genAI
 * @param {string} prompt
 * @param {boolean} [isJson=false]
 * @returns {Promise<{ text: string, modelUsed: string }>}
 */
const callGeminiWithFallback = async (genAI, prompt, isJson = false) => {
  const preferredModel = process.env.GEMINI_MODEL;
  const candidateModels = [
    preferredModel,
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-1.5-flash'
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const config = isJson ? { responseMimeType: 'application/json' } : {};
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        text: response.text(),
        modelUsed: modelName
      };
    } catch (err) {
      lastError = err;
      const msg = err.message || '';
      // If error is 404 not found, 503 high demand, or deprecated, try next candidate
      if (
        msg.includes('404') ||
        msg.includes('503') ||
        msg.includes('not found') ||
        msg.includes('no longer available') ||
        msg.includes('high demand')
      ) {
        console.warn(`⚠️ [aiResumeAnalyzer] Model ${modelName} unavailable, trying next model in chain...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

/**
 * Analyze resume text using Google Gemini API
 * @param {string} resumeText - Raw text extracted from resume PDF
 * @returns {Promise<object>} Structured resume feedback object
 */
const analyzeResumeWithAI = async (resumeText) => {
  // 1. Validate input
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
    const error = new Error('Resume text is too short or empty. Please ensure the resume contains at least 50 characters of readable text.');
    error.code = 'INVALID_RESUME_TEXT';
    error.statusCode = 400;
    throw error;
  }

  const trimmedText = resumeText.trim();
  const genAI = getGeminiClient();

  const prompt = `You are an expert resume coach with 20+ years of talent acquisition and executive hiring experience.
Analyze the following resume and provide structured, objective, and actionable feedback.

Evaluate across these 7 dimensions:
1. Grammar and spelling (typos, punctuation, syntax errors)
2. Professional tone (executive voice, confident phrasing, avoidance of casual slang or passive speech)
3. Achievement metrics (how well accomplishments are quantified with numbers, percentages, currency, scale)
4. Action verbs usage (strong vs weak verbs, power verb substitutions)
5. Quantifiable results (metrics detected and missing opportunities)
6. Readability & formatting (structure, layout clarity, section flow, bullet brevity)
7. Overall quality score (0-100)

RESUME TEXT TO EVALUATE:
"""
${trimmedText}
"""

YOU MUST RETURN ONLY A VALID JSON OBJECT WITH EXACTLY THIS SCHEMA (no explanatory text outside JSON):
{
  "overallScore": 85,
  "readabilityScore": 90,
  "grammar": {
    "score": 95,
    "issues": ["Issue 1", "Issue 2"],
    "suggestions": ["Suggestion 1", "Suggestion 2"]
  },
  "tone": {
    "score": 80,
    "feedback": "Summary description of professional tone",
    "suggestions": ["Tone suggestion 1"]
  },
  "achievements": {
    "score": 75,
    "feedback": "Evaluation of whether responsibilities were turned into measurable achievements",
    "suggestions": ["Achievement suggestion 1"]
  },
  "actionVerbs": {
    "score": 70,
    "currentVerbs": ["helped", "worked on", "managed"],
    "suggestedVerbs": ["spearheaded", "architected", "accelerated", "engineered"],
    "suggestions": ["Replace passive verbs with high-impact power verbs"]
  },
  "quantifiableResults": {
    "score": 65,
    "found": ["Increased test coverage by 30%"],
    "missing": ["Team size metrics", "Revenue or latency impact figures"],
    "suggestions": ["Add metrics like percentages, revenue, time saved, or team count"]
  },
  "formatting": {
    "score": 85,
    "issues": ["Bullet points are overly long in work experience"],
    "suggestions": ["Keep bullet points concise (1-2 lines each)"]
  },
  "strengths": [
    "Clear career progression in full stack development",
    "Strong technical skills section with modern frameworks"
  ],
  "weaknesses": [
    "Several project bullet points lack quantifiable business outcomes",
    "Action verbs in early roles are repetitive"
  ],
  "topImprovements": [
    {
      "priority": "high",
      "category": "achievements",
      "suggestion": "Add specific percentages or scale numbers to your most recent position"
    },
    {
      "priority": "medium",
      "category": "actionVerbs",
      "suggestion": "Replace passive verbs like 'worked on' with active drivers like 'engineered' or 'orchestrated'"
    },
    {
      "priority": "low",
      "category": "formatting",
      "suggestion": "Group technical skills into Frontend, Backend, Database, and DevOps subsections"
    }
  ],
  "improvementSummary": "A concise executive summary paragraph describing the resume's core strengths and the highest-leverage improvements to stand out to hiring managers.",
  "nextSteps": [
    "Rewrite recent bullet points using the X-Y-Z formula (Accomplished X, measured by Y, by doing Z)",
    "Audit all bullet points to start with unique power verbs",
    "Review numbers and add quantifiable impact wherever possible"
  ]
}`;

  try {
    const { text: rawText, modelUsed } = await callGeminiWithFallback(genAI, prompt, true);
    const cleanedText = cleanJsonResponse(rawText);

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ [aiResumeAnalyzer] JSON parse error on raw output:', rawText);
      throw new Error('AI returned an unparseable response. Please retry.');
    }

    // Sanitize and ensure complete schema
    const feedback = {
      overallScore: Math.min(100, Math.max(0, parseInt(parsed.overallScore, 10) || 75)),
      readabilityScore: Math.min(100, Math.max(0, parseInt(parsed.readabilityScore, 10) || 80)),
      grammar: {
        score: Math.min(100, Math.max(0, parseInt(parsed.grammar?.score, 10) || 85)),
        issues: Array.isArray(parsed.grammar?.issues) ? parsed.grammar.issues : [],
        suggestions: Array.isArray(parsed.grammar?.suggestions) ? parsed.grammar.suggestions : []
      },
      tone: {
        score: Math.min(100, Math.max(0, parseInt(parsed.tone?.score, 10) || 80)),
        feedback: parsed.tone?.feedback || 'Professional and direct tone.',
        suggestions: Array.isArray(parsed.tone?.suggestions) ? parsed.tone.suggestions : []
      },
      achievements: {
        score: Math.min(100, Math.max(0, parseInt(parsed.achievements?.score, 10) || 75)),
        feedback: parsed.achievements?.feedback || 'Achievements present but can be elevated with measurable outcomes.',
        suggestions: Array.isArray(parsed.achievements?.suggestions) ? parsed.achievements.suggestions : []
      },
      actionVerbs: {
        score: Math.min(100, Math.max(0, parseInt(parsed.actionVerbs?.score, 10) || 75)),
        currentVerbs: Array.isArray(parsed.actionVerbs?.currentVerbs) ? parsed.actionVerbs.currentVerbs : [],
        suggestedVerbs: Array.isArray(parsed.actionVerbs?.suggestedVerbs) ? parsed.actionVerbs.suggestedVerbs : [],
        suggestions: Array.isArray(parsed.actionVerbs?.suggestions) ? parsed.actionVerbs.suggestions : []
      },
      quantifiableResults: {
        score: Math.min(100, Math.max(0, parseInt(parsed.quantifiableResults?.score, 10) || 70)),
        found: Array.isArray(parsed.quantifiableResults?.found) ? parsed.quantifiableResults.found : [],
        missing: Array.isArray(parsed.quantifiableResults?.missing) ? parsed.quantifiableResults.missing : [],
        suggestions: Array.isArray(parsed.quantifiableResults?.suggestions) ? parsed.quantifiableResults.suggestions : []
      },
      formatting: {
        score: Math.min(100, Math.max(0, parseInt(parsed.formatting?.score, 10) || 85)),
        issues: Array.isArray(parsed.formatting?.issues) ? parsed.formatting.issues : [],
        suggestions: Array.isArray(parsed.formatting?.suggestions) ? parsed.formatting.suggestions : []
      },
      strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
        ? parsed.strengths
        : ['Clear technical competencies highlighted', 'Relevant professional background'],
      weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0
        ? parsed.weaknesses
        : ['Needs more quantifiable impact metrics', 'Action verbs can be made more dynamic'],
      topImprovements: Array.isArray(parsed.topImprovements) && parsed.topImprovements.length > 0
        ? parsed.topImprovements
        : [
            { priority: 'high', category: 'achievements', suggestion: 'Add measurable results to work experience' },
            { priority: 'medium', category: 'actionVerbs', suggestion: 'Use stronger power verbs' }
          ],
      improvementSummary: parsed.improvementSummary || 'Overall solid resume that will significantly stand out once accomplishments are quantified with metrics.',
      nextSteps: Array.isArray(parsed.nextSteps) && parsed.nextSteps.length > 0
        ? parsed.nextSteps
        : [
            'Incorporate specific metrics and percentages to work experience',
            'Upgrade bullet points with strong power action verbs',
            'Ensure all sections follow standard ATS-friendly naming'
          ],
      analyzedAt: new Date().toISOString(),
      modelUsed: modelUsed || 'gemini-3.5-flash-lite'
    };

    return feedback;
  } catch (error) {
    throw normalizeAiError(error);
  }
};

/**
 * Generate an improved, rewritten resume using Gemini AI
 * @param {string} resumeText - Original resume text
 * @param {object} [feedback] - AI feedback object containing suggestions and verb ideas
 * @returns {Promise<string>} Improved resume text
 */
const generateImprovedResume = async (resumeText, feedback = {}) => {
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
    const error = new Error('Original resume text is too short or empty to rewrite.');
    error.code = 'INVALID_RESUME_TEXT';
    error.statusCode = 400;
    throw error;
  }

  const trimmedText = resumeText.trim();
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  const suggestedVerbs = feedback?.actionVerbs?.suggestedVerbs?.length
    ? feedback.actionVerbs.suggestedVerbs.join(', ')
    : 'spearheaded, architected, accelerated, engineered, scaled, optimized';

  const quantifiableSuggestions = feedback?.quantifiableResults?.suggestions?.length
    ? feedback.quantifiableResults.suggestions.join('; ')
    : 'Quantify metrics such as latency reduction, team size, users impacted, or percentage improvements';

  const topImprovements = (feedback?.topImprovements || [])
    .map(t => `- [${(t.priority || 'medium').toUpperCase()}] ${t.suggestion}`)
    .join('\n');

  const prompt = `You are an elite executive resume writer with deep expertise in Silicon Valley and Fortune 500 tech hiring.
Rewrite and elevate the following resume into a world-class, impactful, scannable version.

ORIGINAL RESUME CONTENT:
----------------------------------------
${trimmedText}
----------------------------------------

KEY IMPROVEMENT DIRECTIVES BASED ON ANALYSIS:
- Replace weak/passive verbs with strong power action verbs: ${suggestedVerbs}
- Highlight and incorporate metrics/quantification: ${quantifiableSuggestions}
- Apply these specific improvements:
${topImprovements || '- Enhance bullet point outcomes with quantifiable metrics'}

CORE RULES:
1. Preserve 100% factual accuracy: Keep all actual names, companies, roles, dates, degrees, and technologies intact.
2. Structure bullet points with the formula: [High-impact Action Verb] + [Specific Task / Challenge] + [Measurable Business Impact / Metric].
3. Format as clean, professional, scannable plain text with standard uppercase headings (e.g. SUMMARY, SKILLS, PROFESSIONAL EXPERIENCE, EDUCATION, PROJECTS).
4. Do NOT use markdown code blocks or triple backticks. Return ONLY the plain text of the rewritten resume.`;

  try {
    const { text: rawImproved } = await callGeminiWithFallback(genAI, prompt, false);
    let improvedText = rawImproved.trim();

    // Strip any accidental markdown fences
    if (improvedText.startsWith('```')) {
      improvedText = improvedText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
    }

    return improvedText;
  } catch (error) {
    throw normalizeAiError(error);
  }
};

module.exports = {
  analyzeResumeWithAI,
  generateImprovedResume
};
