// backend/utils/interviewPrepAutomation.js
const { Op } = require('sequelize');
const {
  Skill,
  MockInterview,
  Company,
  CompanyInterviewQuestion,
  Job,
  InterviewPrepLog
} = require('../models');

/**
 * Format remaining duration into a human-readable string
 * e.g., "2 days 5 hours", "18 hours", "30 minutes"
 */
const formatTimeRemaining = (diffMs) => {
  if (diffMs <= 0) {
    return 'Happening now / Passed';
  }
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` ${hours} hr${hours > 1 ? 's' : ''}` : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

/**
 * Generate a Google Calendar event template URL
 */
const generateGoogleCalendarUrl = (interview) => {
  try {
    const start = new Date(interview.interviewDatetime || interview.interview_datetime);
    const duration = interview.durationMinutes || interview.duration_minutes || 60;
    const end = new Date(start.getTime() + duration * 60 * 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const toIsoClean = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const title = encodeURIComponent(`${interview.companyName || interview.company_name} Interview – ${interview.stage || 'Round'}`);
    const details = encodeURIComponent(
      `Role: ${interview.roleTitle || interview.role_title}\nStage: ${interview.stage}\nType: ${interview.interviewType || interview.interview_type}\nMeeting Link: ${interview.meetLink || interview.meet_link || 'N/A'}\nNotes: ${interview.notes || 'N/A'}\n\nManaged with Career Copilot`
    );
    const location = encodeURIComponent(interview.meetLink || interview.meet_link || interview.location || 'Online Video Call');
    const dates = `${toIsoClean(start)}/${toIsoClean(end)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch (e) {
    return null;
  }
};

/**
 * Generate a Smart Daily Prep Plan for an Interview
 *
 * Considers:
 * 1. Time remaining until interview date (<24h: high urgency, 1-7d: balanced, >7d: comprehensive)
 * 2. User's skill gaps (weak skills where userLevel < requiredLevel)
 * 3. Mock interview performance (weak categories: behavioral, technical, system design)
 * 4. Company-specific interview questions (from CompanyInterviewQuestion)
 * 5. Role and Stage specifics
 */
const generatePrepPlanForInterview = async (userId, interview) => {
  const interviewDate = new Date(interview.interviewDatetime || interview.interview_datetime);
  const now = new Date();
  const diffMs = interviewDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Determine urgency level
  let urgencyLevel = 'medium';
  if (diffHours <= 24) {
    urgencyLevel = 'high';
  } else if (diffDays <= 7) {
    urgencyLevel = 'medium';
  } else {
    urgencyLevel = 'low';
  }

  const timeUntil = formatTimeRemaining(diffMs);
  const companyName = interview.companyName || interview.company_name || 'Target Company';
  const roleTitle = interview.roleTitle || interview.role_title || 'Software Engineer';
  const stageName = interview.stage || 'Technical Round';
  const interviewType = (interview.interviewType || interview.interview_type || 'technical').toLowerCase();

  // 1. Fetch user context concurrently
  const [userSkills, mockHistory, prepLogs, jobRecord] = await Promise.all([
    Skill.findAll({
      where: { userId },
      attributes: ['skillName', 'category', 'userLevel', 'requiredLevel', 'proficiency'],
      raw: true
    }).catch(() => []),
    MockInterview.findAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit: 5,
      raw: true
    }).catch(() => []),
    InterviewPrepLog.findAll({
      where: { interviewId: interview.id },
      raw: true
    }).catch(() => []),
    interview.jobId || interview.job_id
      ? Job.findByPk(interview.jobId || interview.job_id).catch(() => null)
      : Promise.resolve(null)
  ]);

  // Identify completed task types / descriptions from logs
  const completedTaskSet = new Set();
  prepLogs.forEach((log) => {
    if (log.description) completedTaskSet.add(log.description.trim().toLowerCase());
    if (log.task_type) completedTaskSet.add(log.task_type.trim().toLowerCase());
  });

  // Identify user's weak skills (userLevel < requiredLevel or lowest scores)
  const weakSkills = userSkills
    .map((s) => ({
      name: s.skillName,
      gap: (s.requiredLevel || 75) - (s.userLevel || 50),
      level: s.userLevel || 50
    }))
    .filter((s) => s.gap > 0 || s.level < 70)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  const primaryWeakSkill = weakSkills[0]?.name || (interviewType === 'system_design' ? 'System Design' : 'Data Structures & Algorithms');

  // 2. Fetch company-specific questions if available
  let companyQuestions = [];
  try {
    let companyId = interview.companyId || interview.company_id;
    if (!companyId && companyName) {
      const foundCompany = await Company.findOne({
        where: {
          name: { [Op.like]: `%${companyName.trim()}%` }
        }
      });
      if (foundCompany) companyId = foundCompany.id;
    }

    if (companyId) {
      companyQuestions = await CompanyInterviewQuestion.findAll({
        where: { company_id: companyId },
        limit: 10,
        raw: true
      });
    }
  } catch (err) {
    companyQuestions = [];
  }

  // Fallback questions if none found in DB
  const defaultQuestions = [
    { question: `Design a scalable distributed cache for ${companyName}`, category: 'System Design', role: roleTitle },
    { question: `Describe a challenging bug you debugged in production under high pressure`, category: 'Behavioral', role: roleTitle },
    { question: `How do you optimize render performance and prevent memory leaks in large single page apps?`, category: 'Technical', role: roleTitle },
    { question: `Tell me about a time you strongly disagreed with a product or engineering decision. How did you resolve it?`, category: 'Behavioral', role: roleTitle }
  ];

  const poolOfQuestions = companyQuestions.length > 0 ? companyQuestions : defaultQuestions;
  const sysDesignQ = poolOfQuestions.find((q) => (q.category || '').toLowerCase().includes('design')) || poolOfQuestions[0];
  const behavioralQ = poolOfQuestions.find((q) => (q.category || '').toLowerCase().includes('behavioral')) || poolOfQuestions[1] || poolOfQuestions[0];
  const techQ = poolOfQuestions.find((q) => (q.category || '').toLowerCase().includes('tech')) || poolOfQuestions[2] || poolOfQuestions[0];

  // 3. Build Daily Plan
  const dailyPlan = [];
  const totalDays = Math.max(1, Math.min(diffDays, 14)); // Up to 14 days maximum

  const getDayDateString = (dayOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString().split('T')[0];
  };

  const getDayHeading = (dayOffset) => {
    if (dayOffset === 0) return 'Today (Day 1)';
    if (dayOffset === 1) return 'Tomorrow (Day 2)';
    if (dayOffset === totalDays - 1) return `Interview Day (${getDayDateString(dayOffset)})`;
    return `Day ${dayOffset + 1} (${getDayDateString(dayOffset)})`;
  };

  if (urgencyLevel === 'high' || totalDays === 1) {
    // Under 24h rapid focus plan
    const todayTasks = [
      {
        id: 'task-rapid-1',
        type: 'logistics',
        label: 'Logistics: Test camera, microphone, lighting & check video call link',
        link: interview.meetLink || interview.meet_link || null,
        isExternal: !!(interview.meetLink || interview.meet_link),
        category: 'Setup',
        estimatedMinutes: 15
      },
      {
        id: 'task-rapid-2',
        type: 'behavioral',
        label: `STAR Practice: "${behavioralQ.question}"`,
        link: '/mock-interview',
        category: 'Behavioral',
        sampleQuestion: behavioralQ.question,
        estimatedMinutes: 25
      },
      {
        id: 'task-rapid-3',
        type: 'company_research',
        label: `Quick Scan: Review ${companyName}'s engineering culture & interview process`,
        link: `/company-prep?company=${encodeURIComponent(companyName)}`,
        category: 'Culture',
        estimatedMinutes: 20
      },
      {
        id: 'task-rapid-4',
        type: 'technical_brushup',
        label: `Review key concepts: ${primaryWeakSkill} cheatsheet & past architectural decisions`,
        link: '/skills',
        category: 'Technical',
        estimatedMinutes: 30
      },
      {
        id: 'task-rapid-5',
        type: 'questions_prep',
        label: 'Prepare 3 insightful questions for the interviewer regarding team architecture',
        link: null,
        category: 'Strategy',
        estimatedMinutes: 15
      }
    ];

    dailyPlan.push({
      date: getDayDateString(0),
      dayLabel: getDayHeading(0),
      focus: 'High-Impact Rapid Polish & Readiness Verification',
      tasks: todayTasks.map((t) => ({
        ...t,
        completed: completedTaskSet.has(t.label.toLowerCase()) || completedTaskSet.has(t.type.toLowerCase())
      }))
    });
  } else if (totalDays <= 4) {
    // 2 to 4 days plan
    // Day 0: Fundamentals & Weakest Skill
    dailyPlan.push({
      date: getDayDateString(0),
      dayLabel: getDayHeading(0),
      focus: `Address Core Skill Gap (${primaryWeakSkill}) & Company Discovery`,
      tasks: [
        {
          id: 'task-d0-1',
          type: 'skill_review',
          label: `Brush up on ${primaryWeakSkill} principles and design patterns`,
          link: '/skills',
          category: 'Skills Gap',
          estimatedMinutes: 40,
          completed: false
        },
        {
          id: 'task-d0-2',
          type: 'company_research',
          label: `Study ${companyName}'s core products, tech stack, and recent engineering blogs`,
          link: `/company-prep?company=${encodeURIComponent(companyName)}`,
          category: 'Company',
          estimatedMinutes: 30,
          completed: false
        }
      ]
    });

    // Day 1: Company specific questions & Coding / System design
    dailyPlan.push({
      date: getDayDateString(1),
      dayLabel: getDayHeading(1),
      focus: 'Company-Specific Technical & Design Problems',
      tasks: [
        {
          id: 'task-d1-1',
          type: 'system_design_question',
          label: `Practice: "${sysDesignQ.question}"`,
          link: `/company-prep?tab=questions&search=${encodeURIComponent(companyName)}`,
          category: 'System Design',
          sampleQuestion: sysDesignQ.question,
          estimatedMinutes: 45,
          completed: false
        },
        {
          id: 'task-d1-2',
          type: 'coding',
          label: `Solve 2 recommended coding questions on algorithms & data structures`,
          link: '/coding',
          category: 'Coding',
          estimatedMinutes: 50,
          completed: false
        }
      ]
    });

    // Day 2 / Final Prep
    const finalOffset = totalDays - 1;
    dailyPlan.push({
      date: getDayDateString(finalOffset),
      dayLabel: getDayHeading(finalOffset),
      focus: 'Mock Simulation, STAR Behavioral Stories & Final Checklist',
      tasks: [
        {
          id: 'task-df-1',
          type: 'mock_interview',
          label: `Complete a 30-min AI Mock Interview simulation for ${roleTitle}`,
          link: '/mock-interview',
          category: 'Mock Simulation',
          estimatedMinutes: 35,
          completed: false
        },
        {
          id: 'task-df-2',
          type: 'behavioral',
          label: `Formulate 3 STAR stories: Conflict resolution, technical failure, and proudest achievement`,
          link: '/mock-interview',
          category: 'Behavioral',
          estimatedMinutes: 30,
          completed: false
        },
        {
          id: 'task-df-3',
          type: 'logistics',
          label: 'Verify meeting link, camera, mic, and have resume open on second screen',
          link: interview.meetLink || interview.meet_link || null,
          category: 'Logistics',
          estimatedMinutes: 15,
          completed: false
        }
      ]
    });
  } else {
    // Multi-day extended plan (> 4 days)
    dailyPlan.push({
      date: getDayDateString(0),
      dayLabel: 'Day 1 – Foundations & Diagnostics',
      focus: `Assess Skill Gaps & Deep Dive on ${primaryWeakSkill}`,
      tasks: [
        {
          id: 'task-ext-1',
          type: 'skill_review',
          label: `Diagnose and study ${primaryWeakSkill} core concepts`,
          link: '/skills',
          category: 'Skill Gap',
          estimatedMinutes: 45,
          completed: false
        },
        {
          id: 'task-ext-2',
          type: 'company_research',
          label: `Research ${companyName}'s engineering culture, values & interview rubric`,
          link: `/company-prep?company=${encodeURIComponent(companyName)}`,
          category: 'Research',
          estimatedMinutes: 30,
          completed: false
        }
      ]
    });

    dailyPlan.push({
      date: getDayDateString(1),
      dayLabel: 'Day 2 – Technical Deep Dive',
      focus: 'Algorithm Mastery & Role-Specific Problems',
      tasks: [
        {
          id: 'task-ext-3',
          type: 'coding',
          label: `Solve 3 medium problem sets aligned with ${companyName} frequent tags`,
          link: '/coding',
          category: 'Coding',
          estimatedMinutes: 60,
          completed: false
        },
        {
          id: 'task-ext-4',
          type: 'tech_question',
          label: `Practice: "${techQ.question}"`,
          link: '/mock-interview',
          category: 'Technical',
          sampleQuestion: techQ.question,
          estimatedMinutes: 30,
          completed: false
        }
      ]
    });

    dailyPlan.push({
      date: getDayDateString(2),
      dayLabel: 'Day 3 – Architecture & System Design',
      focus: 'Distributed Systems & Trade-Off Analysis',
      tasks: [
        {
          id: 'task-ext-5',
          type: 'system_design_question',
          label: `Draft architecture for: "${sysDesignQ.question}"`,
          link: `/company-prep?tab=questions`,
          category: 'System Design',
          sampleQuestion: sysDesignQ.question,
          estimatedMinutes: 50,
          completed: false
        }
      ]
    });

    dailyPlan.push({
      date: getDayDateString(3),
      dayLabel: 'Day 4 – Behavioral & Leadership Principles',
      focus: 'STAR Method Stories & Behavioral Alignment',
      tasks: [
        {
          id: 'task-ext-6',
          type: 'behavioral',
          label: `Structure answers for leadership principles: "${behavioralQ.question}"`,
          link: '/mock-interview',
          category: 'Behavioral',
          sampleQuestion: behavioralQ.question,
          estimatedMinutes: 40,
          completed: false
        }
      ]
    });

    dailyPlan.push({
      date: getDayDateString(totalDays - 1),
      dayLabel: `Day ${totalDays} – Interview Day Final Readiness`,
      focus: 'Final Warmup & Logistics Readiness',
      tasks: [
        {
          id: 'task-ext-7',
          type: 'mock_interview',
          label: `Full AI Mock Interview run for ${stageName}`,
          link: '/mock-interview',
          category: 'Simulation',
          estimatedMinutes: 35,
          completed: false
        },
        {
          id: 'task-ext-8',
          type: 'logistics',
          label: 'Test mic, camera, quiet room setup, and open resume/portfolio tabs',
          link: interview.meetLink || interview.meet_link || null,
          category: 'Setup',
          estimatedMinutes: 15,
          completed: false
        }
      ]
    });
  }

  // Mark completion states accurately across the plan
  dailyPlan.forEach((day) => {
    day.tasks = day.tasks.map((task) => {
      const isDone =
        completedTaskSet.has(task.label.trim().toLowerCase()) ||
        completedTaskSet.has(task.type.trim().toLowerCase());
      return { ...task, completed: isDone };
    });
  });

  // Calculate stats
  let totalTasksCount = 0;
  let completedTasksCount = 0;
  dailyPlan.forEach((d) => {
    d.tasks.forEach((t) => {
      totalTasksCount += 1;
      if (t.completed) completedTasksCount += 1;
    });
  });

  // Base readiness score from completed tasks, past mock scores, and skills
  let baseScore = 65;
  if (totalTasksCount > 0) {
    baseScore += Math.round((completedTasksCount / totalTasksCount) * 25);
  }
  if (mockHistory.length > 0) {
    baseScore += 5;
  }
  const readinessScore = Math.min(98, Math.max(50, baseScore));

  // 4. Checklist items
  const checklist = [
    'Test audio, webcam, and lighting in your room',
    'Verify meeting link and backup phone number if connection drops',
    'Open your resume and portfolio projects in clean browser tabs',
    'Prepare 3 thoughtful questions to ask the interviewer about their engineering roadmap',
    `Review ${companyName}'s core values and recent product releases`
  ];

  // 5. Quick Links
  const quickLinks = {
    calendarEvent: generateGoogleCalendarUrl(interview),
    jobPosting: jobRecord?.jobLink || null,
    companyPrep: `/company-prep?company=${encodeURIComponent(companyName)}`,
    mockInterview: `/mock-interview`,
    codingPractice: `/coding`,
    skillGap: `/skills`
  };

  return {
    interviewId: interview.id,
    company: companyName,
    role: roleTitle,
    stage: stageName,
    interviewType,
    interviewDatetime: interview.interviewDatetime || interview.interview_datetime,
    durationMinutes: interview.durationMinutes || interview.duration_minutes || 60,
    meetLink: interview.meetLink || interview.meet_link,
    timeUntil,
    urgencyLevel,
    dailyPlan,
    checklist,
    quickLinks,
    stats: {
      completedTasks: completedTasksCount,
      totalTasks: totalTasksCount,
      readinessScore,
      weakSkillsCount: weakSkills.length,
      primaryWeakSkill
    }
  };
};

module.exports = {
  generatePrepPlanForInterview,
  formatTimeRemaining,
  generateGoogleCalendarUrl
};
