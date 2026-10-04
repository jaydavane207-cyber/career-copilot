// backend/controllers/codingController.js
const { CodingProblem } = require('../models');
const { CODING_STATUSES } = require('../config/constants');
const { Op } = require('sequelize');

// Spaced repetition interval schedule in days: 1, 3, 7, 14, 30 days
const SPACED_INTERVALS = [1, 3, 7, 14, 30];

/**
 * Calculate the next review date given a stage and base date
 */
const calculateNextReviewDate = (stage, baseDate = new Date()) => {
  const stageIndex = Math.min(Math.max(0, stage), SPACED_INTERVALS.length - 1);
  const intervalDays = SPACED_INTERVALS[stageIndex];
  const nextDate = new Date(baseDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return { nextDate, intervalDays };
};

/**
 * Format a problem instance into a clean JSON representation
 */
const formatProblem = (p) => {
  const pJson = p.toJSON ? p.toJSON() : p;
  const problemName = pJson.problemName || pJson.title || 'Untitled Problem';
  const solved = pJson.solved !== undefined && pJson.solved !== null ? Boolean(pJson.solved) : pJson.status === CODING_STATUSES.SOLVED;
  const timeTaken = pJson.timeTaken ?? pJson.timeSpentMinutes ?? 30;
  const notes = pJson.notes || pJson.solutionNotes || '';
  const date = pJson.date || pJson.solvedAt || pJson.createdAt;
  const selfRating = pJson.selfRating ?? 3;
  const reviewStage = pJson.reviewStage ?? 0;

  // Compute due date if missing
  let nextReviewDate = pJson.nextReviewDate;
  if (!nextReviewDate) {
    const base = pJson.lastReviewedAt ? new Date(pJson.lastReviewedAt) : (date ? new Date(date) : new Date());
    nextReviewDate = calculateNextReviewDate(reviewStage, base).nextDate;
  } else {
    nextReviewDate = new Date(nextReviewDate);
  }

  const now = new Date();
  const isDue = now >= nextReviewDate;
  const daysOverdue = isDue ? Math.max(0, Math.floor((now - nextReviewDate) / (1000 * 60 * 60 * 24))) : 0;
  const intervalDays = SPACED_INTERVALS[Math.min(reviewStage, SPACED_INTERVALS.length - 1)];

  return {
    ...pJson,
    problemName,
    title: problemName,
    solved,
    status: solved ? CODING_STATUSES.SOLVED : CODING_STATUSES.ATTEMPTED,
    timeTaken,
    timeSpentMinutes: timeTaken,
    notes,
    solutionNotes: notes,
    date,
    selfRating,
    reviewStage,
    nextReviewDate,
    isDue,
    daysOverdue,
    intervalDays
  };
};

/**
 * POST /api/coding/log (also POST /api/coding)
 * Log a solved or practiced problem
 */
const logProblem = async (req, res, next) => {
  try {
    const {
      problemName,
      title,
      topic,
      difficulty,
      timeTaken,
      timeSpentMinutes,
      selfRating,
      solved,
      notes,
      solutionNotes,
      date,
      problemUrl,
      platform
    } = req.body;

    const finalName = problemName || title;
    if (!finalName || !finalName.trim()) {
      return res.status(400).json({ success: false, message: 'Problem name is required.' });
    }

    const parsedTime = parseInt(timeTaken ?? timeSpentMinutes ?? 30, 10);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      return res.status(400).json({ success: false, message: 'Time taken must be a positive number of minutes.' });
    }

    const parsedRating = Math.min(5, Math.max(1, parseInt(selfRating ?? 3, 10) || 3));
    const isSolved = solved !== undefined ? Boolean(solved) : true;
    const problemDate = date ? new Date(date) : new Date();

    // Standardize difficulty casing: Easy, Medium, Hard
    let diff = 'Medium';
    if (difficulty) {
      const lowerDiff = difficulty.toString().toLowerCase();
      if (lowerDiff.includes('easy')) diff = 'Easy';
      else if (lowerDiff.includes('hard')) diff = 'Hard';
      else diff = 'Medium';
    }

    // Standardize topic (default 'Array')
    const finalTopic = topic && topic.trim() ? topic.trim() : 'Array';

    // Calculate initial spaced repetition review date (1 day after problemDate)
    const { nextDate: initialNextReview } = calculateNextReviewDate(0, problemDate);

    const problem = await CodingProblem.create({
      userId: req.user.id,
      problemName: finalName.trim(),
      title: finalName.trim(),
      topic: finalTopic,
      difficulty: diff,
      timeTaken: parsedTime,
      timeSpentMinutes: parsedTime,
      selfRating: parsedRating,
      solved: isSolved,
      status: isSolved ? CODING_STATUSES.SOLVED : CODING_STATUSES.ATTEMPTED,
      notes: notes || solutionNotes || '',
      solutionNotes: notes || solutionNotes || '',
      date: problemDate,
      solvedAt: problemDate,
      problemUrl: problemUrl || '',
      platform: platform || 'LeetCode',
      reviewStage: 0,
      lastReviewedAt: null,
      nextReviewDate: initialNextReview
    });

    res.status(201).json({
      success: true,
      message: 'Coding problem logged successfully!',
      problem: formatProblem(problem)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/coding/problems (also GET /api/coding)
 * Get all logged problems with filtering and search
 */
const getProblems = async (req, res, next) => {
  try {
    const { topic, difficulty, solved, status, search, date } = req.query;
    const filter = { userId: req.user.id };

    if (topic && topic !== 'All') {
      filter.topic = topic;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = {
        [Op.like]: `%${difficulty}%`
      };
    }

    if (solved !== undefined && solved !== 'All') {
      const isSolvedBool = solved === 'true' || solved === true;
      filter[Op.or] = [
        { solved: isSolvedBool },
        { status: isSolvedBool ? CODING_STATUSES.SOLVED : CODING_STATUSES.ATTEMPTED }
      ];
    } else if (status && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      const searchConditions = [
        { problemName: { [Op.like]: q } },
        { title: { [Op.like]: q } },
        { notes: { [Op.like]: q } },
        { solutionNotes: { [Op.like]: q } },
        { topic: { [Op.like]: q } }
      ];
      if (filter[Op.or]) {
        filter[Op.and] = [{ [Op.or]: filter[Op.or] }, { [Op.or]: searchConditions }];
        delete filter[Op.or];
      } else {
        filter[Op.or] = searchConditions;
      }
    }

    const total = await CodingProblem.count({ where: filter });
    const pageNum = req.query.page ? parseInt(req.query.page, 10) : null;
    const limitNum = req.query.limit ? parseInt(req.query.limit, 10) : (pageNum ? 10 : null);

    const queryOptions = {
      where: filter,
      order: [
        ['createdAt', 'DESC'],
        ['date', 'DESC']
      ]
    };
    if (pageNum && limitNum) {
      queryOptions.limit = limitNum;
      queryOptions.offset = (pageNum - 1) * limitNum;
    }

    const rawProblems = await CodingProblem.findAll(queryOptions);
    const problems = rawProblems.map(formatProblem);

    res.json({
      success: true,
      count: problems.length,
      total,
      problems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/coding/weak-topics
 * Returns DSA topics with <70% success rate
 */
const getWeakTopics = async (req, res, next) => {
  try {
    const rawProblems = await CodingProblem.findAll({
      where: { userId: req.user.id }
    });

    const problems = rawProblems.map(formatProblem);
    const topicStats = {};

    for (const p of problems) {
      const topicName = p.topic || 'General';
      if (!topicStats[topicName]) {
        topicStats[topicName] = {
          topic: topicName,
          total: 0,
          solved: 0,
          struggled: 0,
          totalTime: 0,
          totalRating: 0
        };
      }
      topicStats[topicName].total += 1;
      topicStats[topicName].totalTime += p.timeTaken;
      topicStats[topicName].totalRating += p.selfRating;

      if (p.solved) {
        topicStats[topicName].solved += 1;
      } else {
        topicStats[topicName].struggled += 1;
      }
    }

    // Calculate rates and filter topics with < 70% success rate
    const weakTopics = Object.values(topicStats)
      .map(t => {
        const successRate = Math.round((t.solved / t.total) * 100);
        const avgTime = Math.round(t.totalTime / t.total);
        const avgRating = Number((t.totalRating / t.total).toFixed(1));
        return {
          topic: t.topic,
          total: t.total,
          solved: t.solved,
          struggled: t.struggled,
          successRate,
          weaknessScore: 100 - successRate,
          avgTime,
          avgRating
        };
      })
      .filter(t => t.successRate < 70)
      .sort((a, b) => a.successRate - b.successRate || b.total - a.total);

    res.json({
      success: true,
      count: weakTopics.length,
      weakTopics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/coding/stats
 * Return overall stats, difficulty distribution, time trends, weak topics, topic coverage
 */
const getCodingStats = async (req, res, next) => {
  try {
    const rawProblems = await CodingProblem.findAll({
      where: { userId: req.user.id },
      order: [
        ['date', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });

    const problems = rawProblems.map(formatProblem);
    const totalProblems = problems.length;
    const totalSolved = problems.filter(p => p.solved).length;
    const successRate = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
    const totalMinutes = problems.reduce((acc, p) => acc + p.timeTaken, 0);
    const averageTime = totalProblems > 0 ? Math.round(totalMinutes / totalProblems) : 0;

    // Difficulty counts
    const difficultyCounts = {
      Easy: problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length,
      Medium: problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length,
      Hard: problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length
    };

    // Topic distribution & weak topics calculation
    const topicMap = {};
    for (const p of problems) {
      const topic = p.topic || 'General';
      if (!topicMap[topic]) {
        topicMap[topic] = { topic, total: 0, solved: 0, totalTime: 0 };
      }
      topicMap[topic].total += 1;
      topicMap[topic].totalTime += p.timeTaken;
      if (p.solved) topicMap[topic].solved += 1;
    }

    const topicDistribution = {};
    const topicBreakdown = Object.values(topicMap).map(t => {
      topicDistribution[t.topic] = t.total;
      const rate = Math.round((t.solved / t.total) * 100);
      return {
        topic: t.topic,
        total: t.total,
        solved: t.solved,
        struggled: t.total - t.solved,
        successRate: rate,
        avgTime: Math.round(t.totalTime / t.total)
      };
    }).sort((a, b) => b.total - a.total);

    const weakTopics = topicBreakdown
      .filter(t => t.successRate < 70)
      .sort((a, b) => a.successRate - b.successRate);

    // Time trends calculation (are you getting faster?)
    let timeTrends = {
      trend: 'steady',
      isGettingFaster: false,
      percentageChange: 0,
      overallAverage: averageTime,
      recentAverage: averageTime,
      message: 'Log more problems to track pace improvements.'
    };

    if (totalProblems >= 2) {
      // Look at the latest 5 problems vs earlier problems
      const recentSlice = problems.slice(-5);
      const recentAvg = Math.round(recentSlice.reduce((sum, p) => sum + p.timeTaken, 0) / recentSlice.length);
      const diff = averageTime - recentAvg;

      if (diff > 0) {
        const pct = Math.round((diff / (averageTime || 1)) * 100);
        timeTrends = {
          trend: 'getting_faster',
          isGettingFaster: true,
          percentageChange: pct,
          overallAverage: averageTime,
          recentAverage: recentAvg,
          message: `Getting faster! You are solving ${pct}% faster than your historical average.`
        };
      } else if (diff < 0) {
        const pct = Math.round((Math.abs(diff) / (averageTime || 1)) * 100);
        timeTrends = {
          trend: 'slowing',
          isGettingFaster: false,
          percentageChange: pct,
          overallAverage: averageTime,
          recentAverage: recentAvg,
          message: `Tackling harder problems! Average time has increased by ${pct}%.`
        };
      } else {
        timeTrends = {
          trend: 'steady',
          isGettingFaster: false,
          percentageChange: 0,
          overallAverage: averageTime,
          recentAverage: recentAvg,
          message: 'Pace is consistent across recent practice problems.'
        };
      }
    }

    // Spaced repetition due count
    const dueCount = problems.filter(p => p.isDue).length;

    res.json({
      success: true,
      stats: {
        total: totalProblems,
        totalProblems,
        totalSolved,
        solved: totalSolved,
        successRate,
        averageTime,
        weakTopicsCount: weakTopics.length,
        weakTopics,
        difficultyCounts,
        topicDistribution,
        topicBreakdown,
        timeTrends,
        spacedRepetition: {
          dueCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/coding/spaced-repetition
 * Return problems due for review following 1, 3, 7, 14, 30 day schedule
 */
const getSpacedRepetition = async (req, res, next) => {
  try {
    const rawProblems = await CodingProblem.findAll({
      where: { userId: req.user.id },
      order: [
        ['date', 'ASC']
      ]
    });

    const problems = rawProblems.map(formatProblem);

    // Due problems (overdue or due today)
    const dueProblems = problems
      .filter(p => p.isDue)
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    // Upcoming problems (not due yet, sorted by closest review date)
    const upcomingProblems = problems
      .filter(p => !p.isDue)
      .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate))
      .slice(0, 10);

    res.json({
      success: true,
      dueCount: dueProblems.length,
      dueProblems,
      upcomingProblems,
      intervals: SPACED_INTERVALS
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/coding/:id/review
 * Mark a problem as reviewed in spaced repetition and advance interval
 */
const reviewProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const currentStage = problem.reviewStage || 0;
    const nextStage = currentStage + 1;
    const now = new Date();
    const { nextDate, intervalDays } = calculateNextReviewDate(nextStage, now);

    problem.lastReviewedAt = now;
    problem.reviewStage = nextStage;
    problem.nextReviewDate = nextDate;

    if (req.body.selfRating !== undefined) {
      problem.selfRating = Math.min(5, Math.max(1, parseInt(req.body.selfRating, 10)));
    }
    if (req.body.notes !== undefined) {
      problem.notes = req.body.notes;
      problem.solutionNotes = req.body.notes;
    }

    await problem.save();

    res.json({
      success: true,
      message: `Problem reviewed! Next review scheduled in ${intervalDays} days.`,
      problem: formatProblem(problem)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/coding/:id
 * Update problem details
 */
const updateProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const {
      problemName,
      title,
      topic,
      difficulty,
      timeTaken,
      timeSpentMinutes,
      selfRating,
      solved,
      notes,
      solutionNotes,
      date,
      problemUrl,
      platform
    } = req.body;

    if (problemName !== undefined || title !== undefined) {
      const val = (problemName || title).trim();
      problem.problemName = val;
      problem.title = val;
    }
    if (topic !== undefined) problem.topic = topic.trim();
    if (difficulty !== undefined) {
      let diff = 'Medium';
      const lower = difficulty.toString().toLowerCase();
      if (lower.includes('easy')) diff = 'Easy';
      else if (lower.includes('hard')) diff = 'Hard';
      problem.difficulty = diff;
    }
    if (timeTaken !== undefined || timeSpentMinutes !== undefined) {
      const num = parseInt(timeTaken ?? timeSpentMinutes, 10);
      if (!isNaN(num) && num > 0) {
        problem.timeTaken = num;
        problem.timeSpentMinutes = num;
      }
    }
    if (selfRating !== undefined) {
      problem.selfRating = Math.min(5, Math.max(1, parseInt(selfRating, 10)));
    }
    if (solved !== undefined) {
      const b = Boolean(solved);
      problem.solved = b;
      problem.status = b ? CODING_STATUSES.SOLVED : CODING_STATUSES.ATTEMPTED;
    }
    if (notes !== undefined || solutionNotes !== undefined) {
      const n = notes !== undefined ? notes : solutionNotes;
      problem.notes = n;
      problem.solutionNotes = n;
    }
    if (date !== undefined) {
      problem.date = new Date(date);
      problem.solvedAt = new Date(date);
    }
    if (problemUrl !== undefined) problem.problemUrl = problemUrl;
    if (platform !== undefined) problem.platform = platform;

    await problem.save();

    res.json({
      success: true,
      message: 'Problem updated successfully!',
      problem: formatProblem(problem)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/coding/:id
 * Remove a logged problem
 */
const deleteProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    await problem.destroy();
    res.json({ success: true, message: 'Problem removed successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logProblem,
  getProblems,
  getWeakTopics,
  getCodingStats,
  getSpacedRepetition,
  reviewProblem,
  updateProblem,
  deleteProblem
};
