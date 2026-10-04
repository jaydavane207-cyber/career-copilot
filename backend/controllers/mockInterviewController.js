// backend/controllers/mockInterviewController.js
const { MockInterview } = require('../models');
const questionsData = require('../seeds/questions.json');

/**
 * Fisher-Yates array shuffle for uniform randomness
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * GET /api/mock-interview/questions
 * Returns randomized questions matching interview type and count.
 * Excludes sample answers so the user cannot inspect answers prior to submission.
 */
const getQuestions = async (req, res, next) => {
  try {
    const { type, count = 5, role } = req.query;
    const requestedCount = Math.max(1, parseInt(count, 10) || 5);
    const targetType = type ? type.trim().toLowerCase() : null;
    const targetRole = role ? role.trim().toLowerCase() : null;

    // Filter questions
    let candidates = questionsData.filter(q => {
      const matchType = targetType ? q.type.toLowerCase() === targetType : true;
      const matchRole = targetRole ? (q.role.toLowerCase() === targetRole || q.role.toLowerCase() === 'general') : true;
      return matchType && matchRole;
    });

    // If role filter was too strict, fallback to matching type
    if (candidates.length < requestedCount && targetType) {
      candidates = questionsData.filter(q => q.type.toLowerCase() === targetType);
    }

    // If still empty, use all questions
    if (candidates.length === 0) {
      candidates = [...questionsData];
    }

    // Shuffle and pick unique questions (no duplicates)
    const shuffled = shuffleArray(candidates);
    const seenIds = new Set();
    const selected = [];

    for (const q of shuffled) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        selected.push({
          id: q.id,
          questionId: q.id,
          type: q.type,
          category: q.category,
          role: q.role,
          difficulty: q.difficulty,
          question: q.question,
          expectedKeywords: q.expectedKeywords || []
        });
      }
      if (selected.length >= requestedCount) break;
    }

    res.json({
      success: true,
      count: selected.length,
      questions: selected
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/mock-interview/submit-answer (also supports /submit)
 * Saves user answers and session statistics to the database.
 * Evaluates keyword coverage, enriches with sample answers, and computes rubric score.
 */
const submitAnswer = async (req, res, next) => {
  try {
    const {
      interviewType = 'Technical',
      role,
      answers = [],
      sessionStats = {},
      durationMinutes
    } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one answer is required to submit a session.'
      });
    }

    // Map each answer to its question data in the seed bank
    let totalScore = 0;
    let totalConfidence = 0;
    const evaluatedAnswers = [];
    const strengths = [];
    const areasForImprovement = [];

    for (const item of answers) {
      const qId = item.questionId || item.id;
      const original = questionsData.find(q => q.id === qId) || {};
      const userAnswerText = item.userAnswer || item.userResponse || '';
      const confidence = Math.min(5, Math.max(1, parseInt(item.confidence, 10) || 3));
      const answerLength = item.answerLength || (userAnswerText ? userAnswerText.trim().length : 0);

      totalConfidence += confidence;

      // Evaluation rubric based on expected keywords and answer length
      const keywords = original.expectedKeywords || item.expectedKeywords || [];
      const lowerText = userAnswerText.toLowerCase();

      let matchedKeywordsCount = 0;
      for (const kw of keywords) {
        if (lowerText.includes(kw.toLowerCase())) {
          matchedKeywordsCount++;
        }
      }

      const keywordRatio = keywords.length > 0 ? (matchedKeywordsCount / keywords.length) : (answerLength > 80 ? 0.8 : 0.4);
      let qScore = Math.min(100, Math.round(keywordRatio * 85 + (confidence / 5) * 15));
      if (answerLength < 25) {
        qScore = Math.min(qScore, 30); // penalize extremely short or empty answers
      }

      totalScore += qScore;

      let feedback = '';
      if (qScore >= 75) {
        feedback = 'Strong answer! Demonstrates depth and covers key technical nuances.';
        strengths.push(`${original.category || 'Core'}: Clear explanations and terminology`);
      } else if (qScore >= 50) {
        feedback = 'Solid effort. Could provide deeper structural examples, trade-offs, and metrics.';
      } else {
        feedback = 'Needs improvement: Ensure structured STAR format or architectural trade-offs.';
        if (keywords.length > 0) {
          areasForImprovement.push(`${original.category || 'Core'}: Review ${keywords.slice(0, 3).join(', ')}`);
        }
      }

      evaluatedAnswers.push({
        questionId: qId,
        id: qId,
        question: item.question || original.question,
        category: original.category || item.category || 'General',
        type: original.type || interviewType,
        userAnswer: userAnswerText,
        userResponse: userAnswerText,
        confidence,
        answerLength,
        score: qScore,
        feedback,
        expectedKeywords: keywords,
        sampleAnswer: original.sampleAnswer || null
      });
    }

    const totalQuestions = answers.length;
    const calculatedAvgConfidence = Number((totalConfidence / totalQuestions).toFixed(1));
    const overallScore = Math.round(totalScore / totalQuestions);

    const feedbackSummary = overallScore >= 75
      ? 'Excellent performance! You communicated clearly and demonstrated comprehensive technical depth.'
      : overallScore >= 50
      ? 'Solid effort! Focus on structured frameworks (STAR), concrete metrics, and architectural trade-offs.'
      : 'Good start. Spend time reviewing the sample solutions, key points, and core terminology.';

    const stats = {
      totalQuestions,
      timeSpent: sessionStats.timeSpent || (durationMinutes ? durationMinutes * 60 : totalQuestions * 120),
      avgConfidence: sessionStats.avgConfidence !== undefined ? sessionStats.avgConfidence : calculatedAvgConfidence
    };

    const record = await MockInterview.create({
      userId: req.user.id,
      date: new Date(),
      role: role || req.user.targetRole || 'Fullstack Developer',
      interviewType,
      answers: evaluatedAnswers,
      sessionStats: stats,
      questions: evaluatedAnswers, // synced for backward compatibility
      overallScore,
      feedbackSummary,
      strengths: [...new Set(strengths)].slice(0, 4),
      areasForImprovement: [...new Set(areasForImprovement)].slice(0, 4),
      durationMinutes: Math.round(stats.timeSpent / 60) || 10,
      completedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Interview session submitted and evaluated successfully',
      result: record
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mock-interview/history
 * Returns all past interview attempts for the authenticated user
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await MockInterview.findAll({
      where: { userId: req.user.id },
      order: [['completedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mock-interview/feedback
 * Returns sample answers, key points checklist, and tips for requested questions
 */
const getFeedback = async (req, res, next) => {
  try {
    const { questionId, questionIds, type } = req.query;

    let targetIds = [];
    if (questionId) {
      targetIds = [questionId.trim()];
    } else if (questionIds) {
      targetIds = questionIds.split(',').map(s => s.trim()).filter(Boolean);
    }

    let results = [];
    if (targetIds.length > 0) {
      results = questionsData.filter(q => targetIds.includes(q.id));
    } else if (type) {
      results = questionsData.filter(q => q.type.toLowerCase() === type.trim().toLowerCase());
    } else {
      results = questionsData.slice(0, 10);
    }

    const feedbackList = results.map(q => ({
      questionId: q.id,
      question: q.question,
      type: q.type,
      category: q.category,
      role: q.role,
      difficulty: q.difficulty,
      strongAnswer: q.sampleAnswer?.strongAnswer || '',
      keyPoints: q.sampleAnswer?.keyPoints || [],
      tips: q.sampleAnswer?.tips || '',
      expectedKeywords: q.expectedKeywords || []
    }));

    res.json({
      success: true,
      feedback: feedbackList
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mock-interview/:id
 * Retrieve a specific past interview session by ID
 */
const getSessionById = async (req, res, next) => {
  try {
    const session = await MockInterview.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock interview session not found.'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Legacy startSession alias
 */
const startSession = async (req, res, next) => {
  try {
    const { role, interviewType, questionCount = 5 } = req.body;
    req.query.type = interviewType;
    req.query.count = questionCount;
    req.query.role = role;
    return getQuestions(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  submitAnswer,
  getHistory,
  getFeedback,
  getSessionById,
  startSession,
  submitSession: submitAnswer
};
