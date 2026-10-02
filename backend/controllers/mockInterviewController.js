// backend/controllers/mockInterviewController.js
const { MockInterview } = require('../models');
const questionsData = require('../seeds/questions.json');

const startSession = async (req, res, next) => {
  try {
    const { role, interviewType, questionCount = 5 } = req.body;
    const targetRole = role || req.user.targetRole || 'Fullstack Developer';
    const type = interviewType || 'Technical';

    // Find relevant questions
    let candidates = questionsData.filter(q => {
      const matchRole = q.role.toLowerCase() === targetRole.toLowerCase() || q.role === 'General';
      const matchType = q.type.toLowerCase() === type.toLowerCase();
      return matchRole && matchType;
    });

    if (candidates.length === 0) {
      candidates = questionsData.slice(0, questionCount);
    }

    // Shuffle and pick
    const selectedQuestions = [...candidates]
      .sort(() => 0.5 - Math.random())
      .slice(0, questionCount)
      .map(q => ({
        id: q.id,
        question: q.question,
        category: q.category,
        expectedKeywords: q.expectedKeywords,
        difficulty: q.difficulty,
        userResponse: '',
        score: null,
        feedback: null
      }));

    res.json({
      success: true,
      session: {
        role: targetRole,
        interviewType: type,
        questions: selectedQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

const submitSession = async (req, res, next) => {
  try {
    const { role, interviewType, answers, durationMinutes = 25 } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    let totalScore = 0;
    const evaluatedQuestions = [];
    const strengths = [];
    const areasForImprovement = [];

    for (const item of answers) {
      const resp = (item.userResponse || '').toLowerCase();
      const keywords = item.expectedKeywords || [];

      let matched = 0;
      for (const kw of keywords) {
        if (resp.includes(kw.toLowerCase())) matched++;
      }

      const ratio = keywords.length > 0 ? (matched / keywords.length) : (resp.length > 80 ? 0.8 : 0.4);
      let qScore = Math.min(100, Math.round(ratio * 100));
      if (resp.length < 30) qScore = Math.min(qScore, 35); // penalize very short answers

      totalScore += qScore;

      let feedback = '';
      if (qScore >= 75) {
        feedback = 'Strong answer! Good coverage of essential technical nuances.';
        strengths.push(`${item.category}: Clear explanations and terminology`);
      } else if (qScore >= 50) {
        feedback = 'Decent start, but could provide deeper technical examples or system tradeoffs.';
      } else {
        feedback = 'Needs improvement: Ensure you touch upon key concepts and structured STAR/architectural details.';
        areasForImprovement.push(`${item.category}: Review ${keywords.slice(0, 3).join(', ')}`);
      }

      evaluatedQuestions.push({
        id: item.id,
        question: item.question,
        category: item.category,
        userResponse: item.userResponse,
        expectedKeywords: item.expectedKeywords,
        score: qScore,
        feedback
      });
    }

    const overallScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;
    const feedbackSummary = overallScore >= 75
      ? 'Excellent performance! You communicated clearly and demonstrated comprehensive technical depth.'
      : 'Solid effort. Spend additional time reviewing core architecture tradeoffs and structured answer frameworks.';

    const record = await MockInterview.create({
      userId: req.user.id,
      role: role || req.user.targetRole,
      interviewType: interviewType || 'Technical',
      questions: evaluatedQuestions,
      overallScore,
      feedbackSummary,
      strengths: [...new Set(strengths)].slice(0, 4),
      areasForImprovement: [...new Set(areasForImprovement)].slice(0, 4),
      durationMinutes,
      completedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Interview evaluated successfully',
      result: record
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await MockInterview.findAll({
      where: { userId: req.user.id },
      order: [['completedAt', 'DESC']]
    });

    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const session = await MockInterview.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  submitSession,
  getHistory,
  getSessionById
};
