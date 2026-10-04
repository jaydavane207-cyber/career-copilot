// backend/controllers/mockInterviewController.js
const { MockInterview, MockInterviewQuestion } = require('../models');
const questionsData = require('../seeds/questions.json');
const { v4: uuidv4 } = require('uuid');

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

    let dbQuestions = await MockInterviewQuestion.findAll().catch(() => []);
    let bank = (dbQuestions && dbQuestions.length > 0) ? dbQuestions : questionsData;

    let candidates = bank.filter(q => {
      const qType = (q.type || '').toLowerCase();
      const qRole = (q.role || '').toLowerCase();
      const matchType = targetType ? qType === targetType : true;
      const matchRole = targetRole ? (qRole === targetRole || qRole === 'general') : true;
      return matchType && matchRole;
    });

    if (candidates.length < requestedCount && targetType) {
      candidates = bank.filter(q => (q.type || '').toLowerCase() === targetType);
    }

    if (candidates.length === 0) {
      candidates = [...bank];
    }

    const shuffled = shuffleArray(candidates);
    const seenIds = new Set();
    const selected = [];

    for (const q of shuffled) {
      const qId = q.id;
      if (!seenIds.has(qId)) {
        seenIds.add(qId);
        selected.push({
          id: qId,
          questionId: qId,
          type: q.type,
          category: q.category || 'General',
          role: q.role || 'General',
          difficulty: q.difficulty || 'Medium',
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
 * GET /api/mock-interview/start & POST /api/mock-interview/start
 * startInterview(userId, { type, numQuestions, role }):
 * - Query random questions of requested type from database
 * - Do NOT include sample answers
 * - Create interview session in database
 * - Return { interviewId, questions: [] }
 */
const startInterview = async (req, res, next) => {
  try {
    const type = req.body?.type || req.body?.interviewType || req.query?.type || 'Technical';
    const numQuestions = parseInt(req.body?.numQuestions || req.body?.count || req.query?.numQuestions || req.query?.count || 5, 10);
    const role = req.body?.role || req.query?.role || req.user?.targetRole || 'Fullstack Developer';

    let dbQuestions = await MockInterviewQuestion.findAll().catch(() => []);
    let bank = (dbQuestions && dbQuestions.length > 0) ? dbQuestions : questionsData;

    const targetType = type.trim().toLowerCase();
    let candidates = bank.filter(q => (q.type || '').toLowerCase() === targetType);
    if (candidates.length === 0) {
      candidates = [...bank];
    }

    const shuffled = shuffleArray(candidates);
    const selected = [];
    const seenIds = new Set();

    for (const q of shuffled) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        selected.push({
          id: q.id,
          questionId: q.id,
          type: q.type,
          category: q.category || 'General',
          role: q.role || 'General',
          difficulty: q.difficulty || 'Medium',
          question: q.question,
          expectedKeywords: q.expectedKeywords || []
        });
      }
      if (selected.length >= numQuestions) break;
    }

    // Create session in database
    const session = await MockInterview.create({
      userId: req.user.id,
      interviewType: type,
      role,
      questions: selected,
      answers: [],
      sessionStats: {
        totalQuestions: selected.length,
        timeSpent: 0,
        avgConfidence: 0
      },
      durationMinutes: Math.round(selected.length * 3),
      overallScore: 0
    });

    res.status(201).json({
      success: true,
      interviewId: session.id,
      id: session.id,
      role: session.role,
      interviewType: session.interviewType,
      questions: selected,
      session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Evaluates an array of answers against expected keywords and rubric
 */
const evaluateAnswers = (answersList = []) => {
  let totalScore = 0;
  let totalConfidence = 0;
  const evaluatedAnswers = [];
  const strengths = [];
  const areasForImprovement = [];

  for (const item of answersList) {
    const qId = item.questionId || item.id;
    const original = questionsData.find(q => q.id === qId) || {};
    const userAnswerText = item.userAnswer || item.userResponse || '';
    const confidence = Math.min(5, Math.max(1, parseInt(item.confidence, 10) || 3));
    const answerLength = item.answerLength || (userAnswerText ? userAnswerText.trim().length : 0);

    totalConfidence += confidence;

    const keywords = original.expectedKeywords || item.expectedKeywords || [];
    const lowerText = userAnswerText.toLowerCase();

    let matchedKeywordsCount = 0;
    const matchedKeywords = [];
    const missingKeywords = [];

    for (const kw of keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        matchedKeywordsCount++;
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    const keywordRatio = keywords.length > 0 ? (matchedKeywordsCount / keywords.length) : 0.6;
    const lengthScore = answerLength > 200 ? 1.0 : answerLength > 80 ? 0.75 : answerLength > 30 ? 0.5 : 0.2;
    const confidenceScore = (confidence / 5);

    const questionScore = Math.min(100, Math.round((keywordRatio * 0.5 + lengthScore * 0.3 + confidenceScore * 0.2) * 100));
    totalScore += questionScore;

    const sample = original.sampleAnswer || {};
    const strongAnswer = sample.strongAnswer || 'Provide a structured, quantified response using the STAR technique.';
    const keyPoints = Array.isArray(sample.keyPoints) ? sample.keyPoints : [];
    const tips = sample.tips || original.indiaContextTip || 'Structure answers clearly with concrete impact metrics.';

    evaluatedAnswers.push({
      questionId: qId,
      id: qId,
      question: original.question || item.question || 'Interview Question',
      type: original.type || item.type || 'Technical',
      category: original.category || 'General',
      userAnswer: userAnswerText,
      confidence,
      score: questionScore,
      matchedKeywords,
      missingKeywords,
      sampleAnswer: {
        strongAnswer,
        keyPoints,
        tips
      },
      strongAnswer,
      keyPoints,
      tips
    });

    if (questionScore >= 75) {
      strengths.push(`Strong response on: "${(original.question || item.question || '').slice(0, 50)}..."`);
    } else {
      areasForImprovement.push(`Incorporate more architectural depth and keywords in: "${(original.question || item.question || '').slice(0, 50)}..."`);
    }
  }

  const overallScore = evaluatedAnswers.length > 0
    ? Math.round(totalScore / evaluatedAnswers.length)
    : 0;

  const avgConfidence = evaluatedAnswers.length > 0
    ? Number((totalConfidence / evaluatedAnswers.length).toFixed(1))
    : 3.0;

  return {
    evaluatedAnswers,
    overallScore,
    avgConfidence,
    strengths: strengths.slice(0, 3),
    areasForImprovement: areasForImprovement.slice(0, 3)
  };
};

/**
 * POST /api/mock-interview/submit-answer
 * Supports both:
 * 1. Single question submission: { interviewId, questionId, userAnswer, confidence }
 * 2. Full session submission: { interviewType, role, answers, sessionStats, durationMinutes }
 */
const submitAnswer = async (req, res, next) => {
  try {
    const {
      interviewId,
      questionId,
      userAnswer,
      confidence,
      interviewType = 'Technical',
      role,
      answers = [],
      sessionStats = {},
      durationMinutes
    } = req.body;

    // Mode A: Single answer submission to an active session
    if (interviewId && questionId) {
      const session = await MockInterview.findOne({
        where: { id: interviewId, userId: req.user.id }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'Interview session not found or does not belong to user.'
        });
      }

      let currentAnswers = Array.isArray(session.answers) ? [...session.answers] : [];
      // Replace existing answer for this question or append
      const existingIdx = currentAnswers.findIndex(a => a.questionId === questionId || a.id === questionId);
      const answerRecord = {
        questionId,
        id: questionId,
        userAnswer: userAnswer || '',
        confidence: parseInt(confidence, 10) || 3,
        answeredAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        currentAnswers[existingIdx] = answerRecord;
      } else {
        currentAnswers.push(answerRecord);
      }

      session.answers = currentAnswers;
      session.changed('answers', true);
      const totalQuestions = Array.isArray(session.questions) && session.questions.length > 0
        ? session.questions.length
        : (session.sessionStats?.totalQuestions || currentAnswers.length);

      // Check if all questions have been answered
      const isComplete = currentAnswers.length >= totalQuestions;

      if (isComplete) {
        const evaluation = evaluateAnswers(currentAnswers);
        session.answers = evaluation.evaluatedAnswers;
        session.overallScore = evaluation.overallScore;
        session.strengths = evaluation.strengths;
        session.areasForImprovement = evaluation.areasForImprovement;
        session.sessionStats = {
          totalQuestions,
          timeSpent: session.durationMinutes || 15,
          avgConfidence: evaluation.avgConfidence
        };
        session.completedAt = new Date();
        await session.save();

        return res.json({
          success: true,
          isComplete: true,
          message: 'Interview completed and evaluated!',
          results: {
            interviewId: session.id,
            overallScore: evaluation.overallScore,
            avgConfidence: evaluation.avgConfidence,
            totalQuestions,
            strengths: evaluation.strengths,
            areasForImprovement: evaluation.areasForImprovement,
            answers: evaluation.evaluatedAnswers
          },
          result: session
        });
      } else {
        await session.save();
        return res.json({
          success: true,
          isComplete: false,
          message: 'Answer recorded.',
          nextQuestionIndex: currentAnswers.length,
          hasMore: true
        });
      }
    }

    // Mode B: Bulk session submission
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one answer is required to submit a session.'
      });
    }

    const evaluation = evaluateAnswers(answers);
    const finalDuration = parseInt(durationMinutes, 10) || Math.round(answers.length * 3);

    const record = await MockInterview.create({
      userId: req.user.id,
      interviewType,
      role: role || req.user.targetRole || 'Fullstack Developer',
      answers: evaluation.evaluatedAnswers,
      questions: evaluation.evaluatedAnswers,
      sessionStats: {
        totalQuestions: answers.length,
        timeSpent: finalDuration,
        avgConfidence: evaluation.avgConfidence,
        ...sessionStats
      },
      overallScore: evaluation.overallScore,
      durationMinutes: finalDuration,
      strengths: evaluation.strengths,
      areasForImprovement: evaluation.areasForImprovement,
      feedbackSummary: `Overall performance score of ${evaluation.overallScore}% with average confidence ${evaluation.avgConfidence}/5.`,
      completedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Interview session submitted and evaluated successfully',
      interviewId: record.id,
      overallScore: evaluation.overallScore,
      avgConfidence: evaluation.avgConfidence,
      durationMinutes: finalDuration,
      strengths: evaluation.strengths,
      areasForImprovement: evaluation.areasForImprovement,
      answers: evaluation.evaluatedAnswers,
      result: record
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mock-interview/:id/results
 * getResults(interviewId): Calculate stats, identify weak question types, return results
 */
const getResults = async (req, res, next) => {
  try {
    const session = await MockInterview.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Mock interview session not found.'
      });
    }

    const answers = Array.isArray(session.answers) ? session.answers : [];
    const typeScores = {};

    for (const a of answers) {
      const type = a.type || session.interviewType || 'General';
      if (!typeScores[type]) {
        typeScores[type] = { totalScore: 0, count: 0 };
      }
      typeScores[type].totalScore += (a.score || 50);
      typeScores[type].count += 1;
    }

    const weakTypes = Object.entries(typeScores)
      .map(([type, stats]) => ({
        type,
        avgScore: Math.round(stats.totalScore / stats.count)
      }))
      .filter(t => t.avgScore < 70)
      .sort((a, b) => a.avgScore - b.avgScore);

    res.json({
      success: true,
      interviewId: session.id,
      overallScore: session.overallScore,
      sessionStats: session.sessionStats,
      weakQuestionTypes: weakTypes,
      strengths: session.strengths || [],
      areasForImprovement: session.areasForImprovement || [],
      answers,
      results: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mock-interview/:id/answer/:questionId
 * getAnswerReview(interviewId, questionId):
 * - Get user's answer
 * - Get sample answer from database
 * - Return both
 */
const getAnswerReview = async (req, res, next) => {
  try {
    const { id: interviewId, questionId } = req.params;

    const session = await MockInterview.findOne({
      where: { id: interviewId, userId: req.user.id }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Mock interview session not found.'
      });
    }

    const answers = Array.isArray(session.answers) ? session.answers : [];
    const userAnswerObj = answers.find(a => a.questionId === questionId || a.id === questionId) || {};

    const original = questionsData.find(q => q.id === questionId) || {};
    const sample = original.sampleAnswer || {};

    res.json({
      success: true,
      interviewId,
      questionId,
      question: original.question || userAnswerObj.question,
      userAnswer: userAnswerObj.userAnswer || '',
      confidence: userAnswerObj.confidence || 3,
      score: userAnswerObj.score || 0,
      sampleAnswer: sample.strongAnswer || userAnswerObj.sampleAnswer || '',
      strongAnswer: sample.strongAnswer || userAnswerObj.strongAnswer || '',
      keyPoints: sample.keyPoints || userAnswerObj.keyPoints || [],
      tips: sample.tips || userAnswerObj.tips || ''
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mock-interview/history
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

module.exports = {
  getQuestions,
  startInterview,
  startSession: startInterview,
  submitAnswer,
  submitSession: submitAnswer,
  getResults,
  getAnswerReview,
  getHistory,
  getFeedback,
  getSessionById
};
