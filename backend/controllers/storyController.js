// backend/controllers/storyController.js
const { Op } = require('sequelize');
const {
  SuccessStory,
  StoryComment,
  StoryUpvote,
  User,
  Company,
  UserBadge,
  UserAchievement
} = require('../models');
const { BADGES, ACHIEVEMENTS } = require('../config/badges');
const { awardBadgeHelper, updateAchievementProgressHelper } = require('./leaderboardController');

// Sample initial stories to seed automatically if empty
const INITIAL_SEED_STORIES = [
  {
    company_name: 'Google',
    role: 'Senior Software Engineer',
    experience_level: 'Senior',
    years_experience: 5,
    starting_salary: 195000,
    final_salary: 245000,
    negotiation_amount: 50000,
    salary_percentage_increase: 25.6,
    job_type: 'Full-time',
    location: 'Mountain View, CA',
    interview_duration: 28,
    preparation_weeks: 6,
    interviews_completed: 5,
    mock_interviews_done: 22,
    coding_problems_logged: 240,
    study_plan_followed: true,
    key_preparation: ['Distributed Systems', 'Dynamic Programming', 'Google Leadership Principles', 'System Design'],
    story_title: 'From Rejections to L5 Google SDE: How I Negotiated +$50k',
    story_text: `Six months ago, I was struggling with impostor syndrome and failing first-round screeners. When I received a recruiter outreach for Google L5, I realized my preparation needed structured rigor rather than random LeetCode grinding.\n\nI built a consistent 6-week roadmap with Career Copilot. Every morning started with 2 focused medium-hard problems, followed by system design blueprints in the evening. I completed 22 AI Mock Interviews, which completely transformed how I communicated trade-offs, scalability bottlenecks, and edge cases.\n\nWhen Google's first offer arrived at $195k base + equity, I used the Career Copilot Salary Negotiation framework. By presenting competing offer metrics and articulating the technical impact of my past distributed systems experience, the recruiter returned with an upgraded total package of $245k.\n\nKey takeaway: Never accept the first offer without data, and practice articulating your technical thought process out loud!`,
    key_tips: [
      'Focus 40% of time on System Design scalability (caching, partitioning, consensus)',
      'Run verbal mock interviews daily to speak coherently while solving code',
      'Always negotiate with factual market salary comps and enthusiasm',
      'Structure behavioral answers using STAR method anchored in high-impact metrics'
    ],
    what_helped_most: 'AI Mock Interviews with instant feedback on communication clarity',
    what_hindered: 'Spending too much time on obscure algorithmic puzzles instead of core patterns',
    advice_for_others: 'Consistency trumps intensity. 2 focused hours everyday for 6 weeks will change your life.',
    photos: ['https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80'],
    is_anonymous: false,
    is_verified: true,
    rating: 5,
    helpful_count: 512,
    views: 4320,
    shares: 189,
    status: 'published'
  },
  {
    company_name: 'Microsoft',
    role: 'Product Manager (L62)',
    experience_level: 'Mid',
    years_experience: 3,
    starting_salary: 155000,
    final_salary: 185000,
    negotiation_amount: 30000,
    salary_percentage_increase: 19.3,
    job_type: 'Hybrid',
    location: 'Redmond, WA',
    interview_duration: 21,
    preparation_weeks: 4,
    interviews_completed: 4,
    mock_interviews_done: 16,
    coding_problems_logged: 40,
    study_plan_followed: true,
    key_preparation: ['Product Strategy', 'System Architecture for PMs', 'User Empathy', 'Executive Presentation'],
    story_title: 'Transitioning from Analytics to Microsoft PM: Strategy & Negotiation',
    story_text: `Making the leap from Data Analyst to Product Manager at Microsoft felt daunting. The hiring bar for PMs tests not only technical intuition but deep customer empathy and strategic trade-offs.\n\nI followed the Career Copilot customized study plan for 4 weeks. The interview question simulator helped me hone answers for ambiguous product sense questions like 'Design an AI-first operating system for hospitals'.\n\nDuring the negotiation stage, the team initially made an offer on the lower band of L61. I pushed for an L62 evaluation citing my cross-functional leadership and end-to-end telemetry systems. The committee agreed, bumping the package by $30,000.\n\nBelieve in your transferable skills and practice structure above all!`,
    key_tips: [
      'Always start product design questions by defining the user persona and their pain points',
      'Demonstrate technical curiosity even in non-engineering roles',
      'Practice mock behavioral questions specifically around conflict resolution',
      'Ask insightful questions to the interview panel that show deep company research'
    ],
    what_helped_most: 'Customized company prep questions and structured mock sessions',
    what_hindered: 'Overthinking product metrics instead of focusing on user delight',
    advice_for_others: 'Your past domain experience is your superpower. Connect every dot explicitly.',
    photos: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'],
    is_anonymous: false,
    is_verified: true,
    rating: 5,
    helpful_count: 384,
    views: 2950,
    shares: 142,
    status: 'published'
  },
  {
    company_name: 'Amazon',
    role: 'Frontend Engineer II',
    experience_level: 'Mid',
    years_experience: 2,
    starting_salary: 140000,
    final_salary: 172000,
    negotiation_amount: 32000,
    salary_percentage_increase: 22.8,
    job_type: 'Remote',
    location: 'Seattle, WA',
    interview_duration: 18,
    preparation_weeks: 5,
    interviews_completed: 4,
    mock_interviews_done: 14,
    coding_problems_logged: 160,
    study_plan_followed: true,
    key_preparation: ['React Internals', 'Web Performance', 'Amazon Leadership Principles', 'State Management'],
    story_title: 'Cracked Amazon SDE2 Frontend Remotely with +$32k Negotiation',
    story_text: `Amazon's loop is notorious for their Leadership Principles (LPs). For every single coding and system design question, 50% of the evaluation comes down to LP stories.\n\nI drafted 12 distinct STAR stories covering 'Customer Obsession', 'Ownership', and 'Invent & Simplify'. Career Copilot helped me critique each story to ensure strong quantifiable metrics.\n\nOn the technical frontend round, the prompt was to build an infinite scroll component with virtualization and zero layout shifts. Because I practiced DOM performance and web workers on this platform, I finished with 15 minutes to spare.\n\nNegotiated remote flexibility and a $32k sign-on bonus simply by demonstrating clear readiness!`,
    key_tips: [
      'Write down 2 metrics-driven stories for all 16 Amazon Leadership Principles',
      'Deep dive into JavaScript event loop, rendering pipeline, and memory leaks',
      'Treat the interviewer as a collaborative teammate solving a problem together',
      'Prepare crisp salary counter-proposals with written justification'
    ],
    what_helped_most: 'STAR story builder and frontend system design blueprints',
    what_hindered: 'Neglecting behavioral prep during the first two weeks',
    advice_for_others: 'Frontend engineers must know browser internals, not just high-level UI components.',
    photos: ['https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'],
    is_anonymous: true,
    is_verified: true,
    rating: 5,
    helpful_count: 429,
    views: 3410,
    shares: 165,
    status: 'published'
  }
];

// Helper to seed initial stories if empty
const ensureSeedStories = async () => {
  try {
    const count = await SuccessStory.count();
    if (count === 0) {
      for (const item of INITIAL_SEED_STORIES) {
        await SuccessStory.create(item);
      }
      console.log('🌟 [Seed] Initial community success stories seeded.');
    }
  } catch (err) {
    // ignore
  }
};

/**
 * 1. createSuccessStory
 * POST /api/stories
 */
const createSuccessStory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      company_id,
      companyId,
      company_name,
      companyName,
      role = 'Software Engineer',
      experience_level,
      experienceLevel = 'Mid',
      years_experience,
      yearsExperience = 2,
      starting_salary,
      startingSalary = 150000,
      final_salary,
      finalSalary = 180000,
      negotiation_amount,
      negotiationAmount,
      job_type,
      jobType = 'Full-time',
      location = 'Remote',
      interview_duration,
      interviewDuration = 21,
      preparation_weeks,
      preparationWeeks = 4,
      interviews_completed,
      interviewsCompleted = 4,
      mock_interviews_done,
      mockInterviewsDone = 10,
      coding_problems_logged,
      codingProblemsLogged = 100,
      study_plan_followed = true,
      studyPlanFollowed = true,
      key_preparation = [],
      keyPreparation = [],
      story_title,
      storyTitle,
      story_text,
      storyText,
      key_tips = [],
      keyTips = [],
      what_helped_most,
      whatHelpedMost = 'Mock interviews',
      what_hindered,
      whatHindered = '',
      advice_for_others,
      adviceForOthers = '',
      photos = [],
      is_anonymous = false,
      isAnonymous = false,
      rating = 5
    } = req.body;

    const start = parseInt(startingSalary ?? starting_salary ?? 150000, 10);
    const final = parseInt(finalSalary ?? final_salary ?? 180000, 10);
    const negotiated = parseInt(negotiationAmount ?? negotiation_amount ?? (final > start ? final - start : 0), 10);
    const percentage = start > 0 ? parseFloat((((final - start) / start) * 100).toFixed(1)) : 0;

    const resolvedTitle = storyTitle || story_title || `${role} Offer Journey`;
    const resolvedText = storyText || story_text || '';

    if (!resolvedText || resolvedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Story content is too short. Please share at least 50 characters describing your journey.'
      });
    }

    // Auto verify if user is authenticated
    const isVerified = true;
    const status = 'published';

    const newStory = await SuccessStory.create({
      user_id: userId,
      company_id: companyId ?? company_id ?? null,
      company_name: companyName || company_name || 'Tech Company',
      role,
      experience_level: experienceLevel || experience_level || 'Mid',
      years_experience: parseInt(yearsExperience ?? years_experience ?? 2, 10),
      starting_salary: start,
      final_salary: final,
      negotiation_amount: negotiated,
      salary_percentage_increase: percentage,
      job_type: jobType || job_type || 'Full-time',
      location,
      interview_duration: parseInt(interviewDuration ?? interview_duration ?? 21, 10),
      preparation_weeks: parseInt(preparationWeeks ?? preparation_weeks ?? 4, 10),
      interviews_completed: parseInt(interviewsCompleted ?? interviews_completed ?? 4, 10),
      mock_interviews_done: parseInt(mockInterviewsDone ?? mock_interviews_done ?? 10, 10),
      coding_problems_logged: parseInt(codingProblemsLogged ?? coding_problems_logged ?? 100, 10),
      study_plan_followed: Boolean(studyPlanFollowed ?? study_plan_followed),
      key_preparation: Array.isArray(keyPreparation) && keyPreparation.length ? keyPreparation : key_preparation,
      story_title: resolvedTitle,
      story_text: resolvedText,
      key_tips: Array.isArray(keyTips) && keyTips.length ? keyTips : key_tips,
      what_helped_most: whatHelpedMost || what_helped_most,
      what_hindered: whatHindered || what_hindered,
      advice_for_others: adviceForOthers || advice_for_others,
      photos: Array.isArray(photos) ? photos : [],
      is_anonymous: Boolean(isAnonymous ?? is_anonymous),
      is_verified: isVerified,
      rating: parseInt(rating, 10) || 5,
      helpful_count: 1, // Self initial upvote
      views: 1,
      shares: 0,
      status
    });

    // Gamification & Badges triggering
    let awardedBadges = [];
    let awardedAchievements = [];

    if (userId) {
      // 1. First Success Story Achievement
      const storyCount = await SuccessStory.count({ where: { user_id: userId } });
      const achResult = await updateAchievementProgressHelper(userId, 'first_success_story', storyCount);
      if (achResult?.awarded) awardedAchievements.push(achResult);

      // 2. Negotiation Wizard Badge (+$20k negotiation)
      if (negotiated >= 20000) {
        const badgeResult = await awardBadgeHelper(userId, 'negotiation_wizard');
        if (badgeResult?.awarded) awardedBadges.push(badgeResult);
      }

      // 3. Salary Goal Hit Achievement
      if (negotiated >= 10000) {
        const achSalResult = await updateAchievementProgressHelper(userId, 'salary_goal_hit', negotiated);
        if (achSalResult?.awarded) awardedAchievements.push(achSalResult);
      }
    }

    return res.status(201).json({
      success: true,
      storyId: newStory.id,
      story: newStory,
      status: newStory.status,
      awardedBadges,
      awardedAchievements,
      message: 'Story published successfully! Thank you for inspiring the community.'
    });
  } catch (error) {
    console.error('Error creating success story:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create success story: ' + error.message
    });
  }
};

/**
 * 2. getSuccessStories
 * GET /api/stories
 */
const getSuccessStories = async (req, res) => {
  try {
    await ensureSeedStories();

    const {
      company_id,
      company,
      role,
      experience_level,
      salary_min,
      salary_max,
      search,
      sort = 'helpful',
      limit = 10,
      page = 1
    } = req.query;

    const where = {
      status: 'published'
    };

    if (company_id) {
      where.company_id = company_id;
    }

    if (company && company !== 'All') {
      where[Op.or] = [
        { company_name: { [Op.like]: `%${company}%` } }
      ];
    }

    if (role && role !== 'All') {
      where.role = { [Op.like]: `%${role}%` };
    }

    if (experience_level && experience_level !== 'All') {
      where.experience_level = experience_level;
    }

    if (salary_min || salary_max) {
      where.final_salary = {};
      if (salary_min) where.final_salary[Op.gte] = parseInt(salary_min, 10);
      if (salary_max) where.final_salary[Op.lte] = parseInt(salary_max, 10);
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { story_title: { [Op.like]: q } },
        { story_text: { [Op.like]: q } },
        { company_name: { [Op.like]: q } },
        { role: { [Op.like]: q } }
      ];
    }

    // Sort order
    let order = [['helpful_count', 'DESC']];
    if (sort === 'newest') {
      order = [['created_at', 'DESC']];
    } else if (sort === 'views') {
      order = [['views', 'DESC']];
    } else if (sort === 'salary') {
      order = [['final_salary', 'DESC']];
    } else if (sort === 'negotiation') {
      order = [['negotiation_amount', 'DESC']];
    }

    const pageSize = Math.max(1, parseInt(limit, 10) || 10);
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const offset = (currentPage - 1) * pageSize;

    const { rows: stories, count: total } = await SuccessStory.findAndCountAll({
      where,
      order,
      limit: pageSize,
      offset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'targetRole']
        }
      ]
    });

    // Check user upvotes if token provided
    let userUpvotedStoryIds = new Set();
    const userId = req.user?.id;
    if (userId) {
      const userUpvotes = await StoryUpvote.findAll({
        where: { user_id: userId },
        attributes: ['story_id']
      });
      userUpvotes.forEach(u => userUpvotedStoryIds.add(u.story_id));
    }

    const formattedStories = stories.map(story => {
      const plain = story.toJSON();
      const isAnon = plain.is_anonymous || !plain.author;
      const authorName = isAnon ? 'Anonymous Achiever' : (plain.author.name || 'Community Member');
      const previewText = plain.story_text ? plain.story_text.substring(0, 220) + (plain.story_text.length > 220 ? '...' : '') : '';

      return {
        ...plain,
        author_name: authorName,
        story_preview: previewText,
        has_upvoted: userUpvotedStoryIds.has(plain.id)
      };
    });

    return res.json({
      success: true,
      stories: formattedStories,
      total,
      page: currentPage,
      totalPages: Math.ceil(total / pageSize),
      limit: pageSize
    });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch success stories: ' + error.message
    });
  }
};

/**
 * 3. getSuccessStoryDetail
 * GET /api/stories/:id
 */
const getSuccessStoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await SuccessStory.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'targetRole']
        },
        {
          model: StoryComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found.'
      });
    }

    // Increment view count asynchronously
    story.views = (story.views || 0) + 1;
    await story.save().catch(() => {});

    // Check upvote status for current user
    let hasUpvoted = false;
    const userId = req.user?.id;
    if (userId) {
      const upvote = await StoryUpvote.findOne({
        where: { story_id: story.id, user_id: userId }
      });
      hasUpvoted = !!upvote;
    }

    // Fetch related stories (same role or company)
    const relatedStories = await SuccessStory.findAll({
      where: {
        id: { [Op.ne]: story.id },
        status: 'published',
        [Op.or]: [
          { company_name: story.company_name },
          { role: story.role }
        ]
      },
      limit: 3,
      order: [['helpful_count', 'DESC']]
    });

    const plain = story.toJSON();
    const isAnon = plain.is_anonymous || !plain.author;
    const authorName = isAnon ? 'Anonymous Achiever' : (plain.author.name || 'Community Member');

    return res.json({
      success: true,
      story: {
        ...plain,
        author_name: authorName,
        has_upvoted: hasUpvoted
      },
      comments: plain.comments || [],
      related_stories: relatedStories,
      engagement: {
        helpful_count: plain.helpful_count,
        views: plain.views,
        shares: plain.shares
      }
    });
  } catch (error) {
    console.error('Error fetching story detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch story details: ' + error.message
    });
  }
};

/**
 * 4. upvoteStory
 * POST /api/stories/:id/upvote
 */
const upvoteStory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const storyId = parseInt(req.params.id, 10);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to upvote.' });
    }

    const story = await SuccessStory.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const existingUpvote = await StoryUpvote.findOne({
      where: { story_id: storyId, user_id: userId }
    });

    let upvoted = false;
    if (existingUpvote) {
      // Remove upvote
      await existingUpvote.destroy();
      story.helpful_count = Math.max(0, (story.helpful_count || 1) - 1);
      await story.save();
      upvoted = false;
    } else {
      // Add upvote
      await StoryUpvote.create({
        story_id: storyId,
        user_id: userId
      });
      story.helpful_count = (story.helpful_count || 0) + 1;
      await story.save();
      upvoted = true;

      // Update Community Helper achievement
      const totalHelps = await StoryUpvote.count({ where: { user_id: userId } });
      await updateAchievementProgressHelper(userId, 'community_helper', totalHelps);
      if (totalHelps >= 10) {
        await awardBadgeHelper(userId, 'community_helper');
      }
    }

    return res.json({
      success: true,
      helpful_count: story.helpful_count,
      upvoted,
      message: upvoted ? 'Thanks for upvoting!' : 'Upvote removed.'
    });
  } catch (error) {
    console.error('Error toggling story upvote:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle upvote: ' + error.message
    });
  }
};

/**
 * 5. shareStory
 * POST /api/stories/:id/share
 */
const shareStory = async (req, res) => {
  try {
    const storyId = parseInt(req.params.id, 10);
    const { platform = 'generic' } = req.query;

    const story = await SuccessStory.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    story.shares = (story.shares || 0) + 1;
    await story.save();

    const baseUrl = process.env.CLIENT_URL || 'https://careercopilot.ai';
    const storyUrl = `${baseUrl}/stories/${storyId}`;
    const text = encodeURIComponent(`Check out this incredible offer journey: "${story.story_title}" on Career Copilot!`);

    return res.json({
      success: true,
      shares: story.shares,
      share_url: storyUrl,
      share_text: `Just read this inspiring journey on Career Copilot: ${story.story_title}`,
      platform_urls: {
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(storyUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(storyUrl)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(storyUrl)}`
      }
    });
  } catch (error) {
    console.error('Error sharing story:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process story share: ' + error.message
    });
  }
};

/**
 * 6. addComment
 * POST /api/stories/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const storyId = parseInt(req.params.id, 10);
    const { comment_text, commentText, rating = 5 } = req.body;

    const text = commentText || comment_text;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
    }

    const story = await SuccessStory.findByPk(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const comment = await StoryComment.create({
      story_id: storyId,
      user_id: userId,
      comment_text: text.trim(),
      rating: parseInt(rating, 10) || 5,
      helpful_count: 0
    });

    const fullComment = await StoryComment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ]
    });

    // Check Community Helper achievement
    const userCommentsCount = await StoryComment.count({ where: { user_id: userId } });
    await updateAchievementProgressHelper(userId, 'community_helper', userCommentsCount);

    return res.status(201).json({
      success: true,
      comment: fullComment,
      message: 'Comment posted successfully!'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to post comment: ' + error.message
    });
  }
};

module.exports = {
  createSuccessStory,
  getSuccessStories,
  getSuccessStoryDetail,
  upvoteStory,
  shareStory,
  addComment
};
