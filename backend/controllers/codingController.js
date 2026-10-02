// backend/controllers/codingController.js
const { CodingProblem } = require('../models');
const { CODING_STATUSES } = require('../config/constants');

const getProblems = async (req, res, next) => {
  try {
    const { status, difficulty, topic } = req.query;
    const filter = { userId: req.user.id };

    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;

    const problems = await CodingProblem.findAll({
      where: filter,
      order: [['solvedAt', 'DESC']]
    });

    res.json({ success: true, count: problems.length, problems });
  } catch (error) {
    next(error);
  }
};

const logProblem = async (req, res, next) => {
  try {
    const { title, problemUrl, platform, difficulty, topic, status, timeSpentMinutes, solutionNotes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Problem title is required.' });
    }

    const problem = await CodingProblem.create({
      userId: req.user.id,
      title,
      problemUrl,
      platform: platform || 'LeetCode',
      difficulty: difficulty || 'Medium',
      topic: topic || 'Arrays',
      status: status || CODING_STATUSES.SOLVED,
      timeSpentMinutes: timeSpentMinutes || 30,
      solutionNotes,
      solvedAt: new Date()
    });

    res.status(201).json({ success: true, message: 'Coding problem logged!', problem });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const fields = ['title', 'problemUrl', 'platform', 'difficulty', 'topic', 'status', 'timeSpentMinutes', 'solutionNotes'];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        problem[f] = req.body[f];
      }
    }
    await problem.save();

    res.json({ success: true, message: 'Problem updated', problem });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    await problem.destroy();
    res.json({ success: true, message: 'Problem removed.' });
  } catch (error) {
    next(error);
  }
};

const getCodingStats = async (req, res, next) => {
  try {
    const problems = await CodingProblem.findAll({
      where: { userId: req.user.id }
    });

    const total = problems.length;
    const solved = problems.filter(p => p.status === 'Solved').length;
    const review = problems.filter(p => p.status === 'Review').length;

    const difficultyCounts = {
      Easy: problems.filter(p => p.difficulty === 'Easy').length,
      Medium: problems.filter(p => p.difficulty === 'Medium').length,
      Hard: problems.filter(p => p.difficulty === 'Hard').length
    };

    const topicDistribution = {};
    for (const p of problems) {
      topicDistribution[p.topic] = (topicDistribution[p.topic] || 0) + 1;
    }

    res.json({
      success: true,
      stats: {
        total,
        solved,
        review,
        difficultyCounts,
        topicDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

const getWeakTopics = async (req, res, next) => {
  try {
    const problems = await CodingProblem.findAll({
      where: { userId: req.user.id }
    });

    const topicStats = {};
    for (const p of problems) {
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { total: 0, needsReview: 0, solved: 0 };
      }
      topicStats[p.topic].total += 1;
      if (p.status === 'Review') topicStats[p.topic].needsReview += 1;
      if (p.status === 'Solved') topicStats[p.topic].solved += 1;
    }

    // Topics with highest review ratio or low count
    const weakList = Object.keys(topicStats)
      .map(topic => ({
        topic,
        ...topicStats[topic],
        weaknessScore: Math.round((topicStats[topic].needsReview / topicStats[topic].total) * 100)
      }))
      .sort((a, b) => b.weaknessScore - a.weaknessScore);

    res.json({ success: true, weakTopics: weakList });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  logProblem,
  updateProblem,
  deleteProblem,
  getCodingStats,
  getWeakTopics
};
