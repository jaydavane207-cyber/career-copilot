// backend/utils/readinessCalculator.js
const { Resume, Skill, CodingProblem, MockInterview, Job, StudyPlan, User } = require('../models');
const rolesData = require('../seeds/roles.json');

/**
 * Readiness Label thresholds:
 * 0-33: "Start Here"
 * 34-66: "Getting There"
 * 67-100: "Ready!"
 */
const getReadinessLabel = (score) => {
  if (score <= 33) return 'Start Here';
  if (score <= 66) return 'Getting There';
  return 'Ready!';
};

/**
 * Calculates weighted readiness score and gathers unified dashboard data
 *
 * READINESS SCORE FORMULA (weighted):
 * readinessScore = (
 *   resumeAnalysisScore * 0.20 +     // Avg match score from all analyses
 *   skillGapScore * 0.30 +             // 100 - (average gap %)
 *   studyPlanProgress * 0.25 +         // % of study plan completed
 *   interviewPracticeScore * 0.25      // Avg confidence from mock interviews
 * )
 */
const calculateReadinessScore = async (userId, userTargetRole) => {
  const user = await User.findByPk(userId);
  const targetRole = userTargetRole || (user ? user.targetRole : 'Frontend Developer') || 'Frontend Developer';

  // ----------------------------------------------------
  // 1. Resume Match Score (weight 0.20)
  // Avg match score from all analyses across user resumes
  // ----------------------------------------------------
  const resumes = await Resume.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });

  let matchScores = [];
  for (const r of resumes) {
    if (Array.isArray(r.analyses) && r.analyses.length > 0) {
      for (const an of r.analyses) {
        if (typeof an.matchScore === 'number') {
          matchScores.push(an.matchScore);
        }
      }
    } else if (typeof r.atsScore === 'number' && r.atsScore > 0) {
      matchScores.push(r.atsScore);
    }
  }

  let resumeScore = 0;
  if (matchScores.length > 0) {
    resumeScore = Math.min(100, Math.max(0, Math.round(matchScores.reduce((acc, v) => acc + v, 0) / matchScores.length)));
  }

  // ----------------------------------------------------
  // 2. Skill Gap Score (weight 0.30)
  // 100 - (average gap %)
  // ----------------------------------------------------
  const userSkills = await Skill.findAll({ where: { userId } });
  const matchedRole = rolesData.find(
    r => r.title.toLowerCase() === targetRole.toLowerCase()
  ) || rolesData.find(
    r => r.title.toLowerCase().includes(targetRole.toLowerCase())
  ) || rolesData[0];

  const coreSkills = matchedRole ? (matchedRole.coreSkills || []) : [];
  let masteredSkills = [];
  let missingSkills = [];

  for (const cs of coreSkills) {
    const found = userSkills.find(s => s.skillName.toLowerCase() === cs.toLowerCase());
    if (found) {
      masteredSkills.push(cs);
    } else {
      missingSkills.push(cs);
    }
  }

  let skillGapScore = 0;
  if (coreSkills.length > 0) {
    const coveragePercentage = Math.round((masteredSkills.length / coreSkills.length) * 100);
    // 100 - (average gap %) = coveragePercentage
    skillGapScore = Math.min(100, Math.max(0, coveragePercentage));
  } else if (userSkills.length > 0) {
    skillGapScore = Math.min(100, userSkills.length * 15);
  }

  // ----------------------------------------------------
  // 3. Study Plan Progress (weight 0.25)
  // % of study plan completed
  // ----------------------------------------------------
  const activePlan = await StudyPlan.findOne({
    where: { userId, isActive: true },
    order: [['createdAt', 'DESC']]
  }) || await StudyPlan.findOne({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });

  const studyProgress = activePlan ? Math.min(100, Math.max(0, Math.round(activePlan.progress || 0))) : 0;

  // ----------------------------------------------------
  // 4. Interview Practice Score (weight 0.25)
  // Avg confidence from mock interviews
  // ----------------------------------------------------
  const interviews = await MockInterview.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']]
  });

  let interviewScore = 0;
  if (interviews.length > 0) {
    let confidences = [];
    for (const inv of interviews) {
      const stats = inv.sessionStats;
      if (stats && typeof stats.avgConfidence === 'number' && stats.avgConfidence > 0) {
        // stats.avgConfidence is 1-5 scale, normalize to 100
        confidences.push(Math.round((stats.avgConfidence / 5) * 100));
      } else if (Array.isArray(inv.answers) && inv.answers.length > 0) {
        const itemConfs = inv.answers.map(a => a.confidence).filter(c => typeof c === 'number' && c > 0);
        if (itemConfs.length > 0) {
          const avg = itemConfs.reduce((a, b) => a + b, 0) / itemConfs.length;
          confidences.push(Math.round((avg / 5) * 100));
        } else if (typeof inv.overallScore === 'number' && inv.overallScore > 0) {
          confidences.push(inv.overallScore);
        }
      } else if (typeof inv.overallScore === 'number' && inv.overallScore > 0) {
        confidences.push(inv.overallScore);
      }
    }
    if (confidences.length > 0) {
      interviewScore = Math.min(100, Math.max(0, Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)));
    }
  }

  // ----------------------------------------------------
  // Weighted Total Readiness Score
  // ----------------------------------------------------
  const weightedTotal = (
    resumeScore * 0.20 +
    skillGapScore * 0.30 +
    studyProgress * 0.25 +
    interviewScore * 0.25
  );
  const readinessScore = Math.min(100, Math.max(0, Math.round(weightedTotal)));
  const readinessLabel = getReadinessLabel(readinessScore);

  // ----------------------------------------------------
  // Summary Metrics
  // ----------------------------------------------------
  const totalJobsApplied = await Job.count({ where: { userId } });
  const interviewsScheduled = await Job.count({
    where: {
      userId,
      stage: 'interview'
    }
  });

  // Calculate total study hours logged
  let studyHours = 0;
  if (activePlan) {
    const totalPlanHours = (activePlan.durationWeeks || 4) * (activePlan.hoursPerWeek || 10);
    studyHours += Math.round(totalPlanHours * (studyProgress / 100));
  }

  const codingProblems = await CodingProblem.findAll({ where: { userId } });
  let codingMinutes = 0;
  for (const cp of codingProblems) {
    codingMinutes += (cp.timeSpentMinutes || cp.timeTaken || 30);
  }
  studyHours += Math.round(codingMinutes / 60);

  let interviewMinutes = 0;
  for (const inv of interviews) {
    interviewMinutes += (inv.durationMinutes || (inv.sessionStats ? Math.round((inv.sessionStats.timeSpent || 0) / 60) : 15));
  }
  studyHours += Math.round(interviewMinutes / 60);

  const codesProblemsLogged = codingProblems.length;

  // ----------------------------------------------------
  // Next Actions (Prioritized 3-5 items)
  // ----------------------------------------------------
  const nextActions = [];
  const nextSteps = [];

  // 1. Study Plan Action
  if (!activePlan) {
    nextActions.push(`Create Study Plan for ${targetRole}`);
    nextSteps.push({
      id: 'step-study',
      title: `Create Study Plan for ${targetRole}`,
      action: `Create Study Plan for ${targetRole}`,
      description: 'Generate an AI-customized study roadmap addressing missing core skills.',
      icon: 'BookOpen',
      link: '/study-plan',
      buttonText: 'Go to Study Plan',
      progress: 0,
      priority: 'High'
    });
  } else if (studyProgress < 100) {
    nextActions.push(`Complete Study Plan (${studyProgress}% done)`);
    nextSteps.push({
      id: 'step-study',
      title: `Complete Study Plan (${studyProgress}% done)`,
      action: `Complete Study Plan (${studyProgress}% done)`,
      description: `Active roadmap: ${activePlan.title} (${studyProgress}% complete).`,
      icon: 'BookOpen',
      link: '/study-plan',
      buttonText: 'Go to Study Plan',
      progress: studyProgress,
      priority: 'High'
    });
  }

  // 2. Weak Topic / Coding Action
  const topicCounts = {};
  for (const cp of codingProblems) {
    const t = cp.topic || 'General';
    topicCounts[t] = topicCounts[t] || { total: 0, solved: 0 };
    topicCounts[t].total++;
    if (cp.solved || cp.status === 'Solved') topicCounts[t].solved++;
  }
  let weakTopic = null;
  for (const [t, stats] of Object.entries(topicCounts)) {
    if (stats.total >= 1 && (stats.solved / stats.total) < 0.7) {
      weakTopic = t;
      break;
    }
  }

  if (weakTopic) {
    nextActions.push(`Practice ${weakTopic} questions (weak topic)`);
    nextSteps.push({
      id: 'step-coding-weak',
      title: `Practice ${weakTopic} questions (weak topic)`,
      action: `Practice ${weakTopic} questions (weak topic)`,
      description: `Success rate in ${weakTopic} is under 70%. Reinforce fundamentals.`,
      icon: 'Code2',
      link: '/coding',
      buttonText: 'Go to Coding Tracker',
      progress: Math.round(((topicCounts[weakTopic].solved || 0) / topicCounts[weakTopic].total) * 100),
      priority: 'High'
    });
  } else if (missingSkills.length > 0) {
    const firstMissing = missingSkills[0];
    nextActions.push(`Practice ${firstMissing} questions (weak topic)`);
    nextSteps.push({
      id: 'step-skills-weak',
      title: `Practice ${firstMissing} questions (weak topic)`,
      action: `Practice ${firstMissing} questions (weak topic)`,
      description: `Your target role expects ${firstMissing}. Practice and close this competency gap.`,
      icon: 'CheckCircle2',
      link: '/skills',
      buttonText: 'Go to Skills Gap',
      progress: skillGapScore,
      priority: 'Medium'
    });
  } else if (codesProblemsLogged < 20) {
    const remaining = 20 - codesProblemsLogged;
    nextActions.push(`Solve ${remaining} more coding problems`);
    nextSteps.push({
      id: 'step-coding-more',
      title: 'Practice Coding Problems',
      action: `Solve ${remaining} more coding problems`,
      description: 'Maintain daily algorithmic problem-solving rhythm.',
      icon: 'Code2',
      link: '/coding',
      buttonText: 'Go to Coding Tracker',
      progress: Math.min(100, Math.round((codesProblemsLogged / 20) * 100)),
      priority: 'Medium'
    });
  }

  // 3. Mock Interview Action
  if (interviews.length < 3) {
    const needed = Math.max(1, 3 - interviews.length);
    nextActions.push(`Take ${needed} more mock interview${needed > 1 ? 's' : ''}`);
    nextSteps.push({
      id: 'step-interview-count',
      title: 'Simulate Mock Interview',
      action: `Take ${needed} more mock interview${needed > 1 ? 's' : ''}`,
      description: 'Practice simulated timed interviews across behavioral and technical tracks.',
      icon: 'Mic',
      link: '/mock-interview',
      buttonText: 'Go to Mock Interview',
      progress: Math.min(100, Math.round((interviews.length / 3) * 100)),
      priority: 'High'
    });
  } else if (interviewScore < 80) {
    nextActions.push('Practice System Design interview questions');
    nextSteps.push({
      id: 'step-interview-sd',
      title: 'Boost Interview Confidence',
      action: 'Practice System Design interview questions',
      description: `Average interview confidence is currently ${interviewScore}%. Aim for 80%+.`,
      icon: 'Mic',
      link: '/mock-interview',
      buttonText: 'Go to Mock Interview',
      progress: interviewScore,
      priority: 'Medium'
    });
  }

  // 4. Resume Action if score is low or no resume
  if (resumes.length === 0) {
    nextActions.push(`Upload resume for ${targetRole} ATS check`);
    nextSteps.push({
      id: 'step-resume-upload',
      title: 'Upload Your Resume',
      action: `Upload resume for ${targetRole} ATS check`,
      description: 'Upload your PDF resume to generate ATS match scores and keyword guidance.',
      icon: 'FileText',
      link: '/resume',
      buttonText: 'Go to Resume Analyzer',
      progress: 0,
      priority: 'High'
    });
  } else if (resumeScore < 75) {
    nextActions.push(`Optimize Resume for ${targetRole} (Current: ${resumeScore}%)`);
    nextSteps.push({
      id: 'step-resume-opt',
      title: 'Optimize Resume Keywords',
      action: `Optimize Resume for ${targetRole} (Current: ${resumeScore}%)`,
      description: 'Close missing keyword gaps to increase interview shortlist rates.',
      icon: 'FileText',
      link: '/resume',
      buttonText: 'Go to Resume Analyzer',
      progress: resumeScore,
      priority: 'Medium'
    });
  }

  // 5. Job Pipeline Action
  if (totalJobsApplied < 5) {
    const needed = 5 - totalJobsApplied;
    nextActions.push(`Apply to ${needed} more targeted job postings`);
    nextSteps.push({
      id: 'step-jobs-apply',
      title: 'Expand Job Applications Pipeline',
      action: `Apply to ${needed} more targeted job postings`,
      description: 'Keep 5+ active opportunities in your pipeline for steady interview conversion.',
      icon: 'Send',
      link: '/jobs',
      buttonText: 'Go to Job Tracker',
      progress: Math.min(100, totalJobsApplied * 20),
      priority: 'Medium'
    });
  }

  // Fallback next action if needed to guarantee at least 3
  if (nextActions.length < 3) {
    nextActions.push('Audit Core Skills Alignment');
    nextSteps.push({
      id: 'step-skill-audit',
      title: 'Audit Core Skills Alignment',
      action: 'Audit Core Skills Alignment',
      description: 'Verify your proficiency levels against current market standards.',
      icon: 'CheckCircle2',
      link: '/skills',
      buttonText: 'Go to Skill Audit',
      progress: skillGapScore,
      priority: 'Low'
    });
  }

  const finalNextActions = nextActions.slice(0, 5);
  const finalNextSteps = nextSteps.slice(0, 5);

  // ----------------------------------------------------
  // Time Estimate to be "Ready"
  // ----------------------------------------------------
  let timeEstimate = 'Ready to apply!';
  if (readinessScore >= 67) {
    timeEstimate = 'Ready! Target threshold achieved.';
  } else if (readinessScore === 0) {
    timeEstimate = 'Upload your first resume to calculate pace estimate';
  } else {
    const pointsNeeded = 67 - readinessScore;
    const weeksNeeded = Math.max(1, Math.ceil(pointsNeeded / 8));
    timeEstimate = `~${weeksNeeded} week${weeksNeeded > 1 ? 's' : ''} at current pace`;
  }

  // ----------------------------------------------------
  // Stacked Bar Breakdown
  // Contributions from each module
  // ----------------------------------------------------
  const breakdown = [
    {
      name: 'Resume Match',
      metric: 'Resume Analysis',
      score: resumeScore,
      weight: 20,
      contribution: parseFloat((resumeScore * 0.20).toFixed(1)),
      color: '#3B82F6' // Blue
    },
    {
      name: 'Skills Gap',
      metric: 'Skills Alignment',
      score: skillGapScore,
      weight: 30,
      contribution: parseFloat((skillGapScore * 0.30).toFixed(1)),
      color: '#10B981' // Emerald / Green
    },
    {
      name: 'Study Progress',
      metric: 'Study Plan',
      score: studyProgress,
      weight: 25,
      contribution: parseFloat((studyProgress * 0.25).toFixed(1)),
      color: '#8B5CF6' // Purple
    },
    {
      name: 'Interview Practice',
      metric: 'Mock Interviews',
      score: interviewScore,
      weight: 25,
      contribution: parseFloat((interviewScore * 0.25).toFixed(1)),
      color: '#F59E0B' // Amber
    }
  ];

  const chartStackedData = [
    {
      name: 'Readiness Contributions',
      'Resume Match': parseFloat((resumeScore * 0.20).toFixed(1)),
      'Skills Gap': parseFloat((skillGapScore * 0.30).toFixed(1)),
      'Study Progress': parseFloat((studyProgress * 0.25).toFixed(1)),
      'Interview Practice': parseFloat((interviewScore * 0.25).toFixed(1)),
      total: readinessScore
    }
  ];

  // ----------------------------------------------------
  // Recommend Actions Widget
  // Contextual smart suggestions
  // ----------------------------------------------------
  const recommendations = [];

  // Recommendation 1: System Design / Interview
  if (interviews.length < 3) {
    recommendations.push({
      id: 'rec-1',
      title: 'Interview Preparation',
      text: "You're weak in System Design - practice 3 more interviews",
      type: 'interview',
      actionUrl: '/mock-interview',
      badge: 'High Impact'
    });
  } else if (interviewScore < 75) {
    recommendations.push({
      id: 'rec-1',
      title: 'Interview Confidence',
      text: `Average confidence is ${interviewScore}% - practice 2 more behavioral & technical sessions`,
      type: 'interview',
      actionUrl: '/mock-interview',
      badge: 'High Impact'
    });
  } else {
    recommendations.push({
      id: 'rec-1',
      title: 'Interview Mastery',
      text: 'Interview confidence is strong - maintain pace with 1 weekly mock interview',
      type: 'interview',
      actionUrl: '/mock-interview',
      badge: 'Maintained'
    });
  }

  // Recommendation 2: Algorithms / Weak topic
  if (weakTopic) {
    recommendations.push({
      id: 'rec-2',
      title: 'Algorithmic Accuracy',
      text: `${weakTopic} success rate is ${(topicCounts[weakTopic].total > 0 ? Math.round((topicCounts[weakTopic].solved / topicCounts[weakTopic].total) * 100) : 60)}% - review basics`,
      type: 'coding',
      actionUrl: '/coding',
      badge: 'Review Needed'
    });
  } else {
    recommendations.push({
      id: 'rec-2',
      title: 'Algorithmic Accuracy',
      text: 'Binary Trees success rate is 60% - review basics',
      type: 'coding',
      actionUrl: '/coding',
      badge: 'Review Needed'
    });
  }

  // Recommendation 3: Job Pipeline
  recommendations.push({
    id: 'rec-3',
    title: 'Application Pipeline',
    text: `Job application pipeline: ${totalJobsApplied} applied, ${interviewsScheduled} interview - follow up!`,
    type: 'jobs',
    actionUrl: '/jobs',
    badge: 'Pipeline'
  });

  // ----------------------------------------------------
  // Recent 5 Activities Timeline
  // ----------------------------------------------------
  const activities = [];

  // Resumes
  for (const r of resumes.slice(0, 3)) {
    activities.push({
      id: `act-resume-${r.id}`,
      type: 'resume',
      title: 'Resume Uploaded & Analyzed',
      description: `${r.fileName || 'Resume'} analyzed with ${r.atsScore || 0}% ATS match`,
      date: r.createdAt || r.uploadedAt,
      link: '/resume'
    });
  }

  // Mock Interviews
  for (const inv of interviews.slice(0, 3)) {
    activities.push({
      id: `act-interview-${inv.id}`,
      type: 'interview',
      title: `${inv.interviewType || 'Technical'} Mock Interview Taken`,
      description: `Confidence ${Math.round(inv.overallScore || (inv.sessionStats ? (inv.sessionStats.avgConfidence / 5) * 100 : 70))}% in ${inv.durationMinutes || 10}m session`,
      date: inv.completedAt || inv.createdAt,
      link: '/mock-interview'
    });
  }

  // Coding Problems
  for (const cp of codingProblems.slice(0, 3)) {
    activities.push({
      id: `act-coding-${cp.id}`,
      type: 'coding',
      title: `Problem Logged: ${cp.problemName || cp.title}`,
      description: `${cp.difficulty || 'Medium'} difficulty in ${cp.topic || 'Algorithms'} (${cp.status || 'Solved'})`,
      date: cp.solvedAt || cp.createdAt,
      link: '/coding'
    });
  }

  // Jobs
  const recentJobs = await Job.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: 3
  });
  for (const j of recentJobs) {
    activities.push({
      id: `act-job-${j.id}`,
      type: 'job',
      title: `Applied to ${j.companyName}`,
      description: `Role: ${j.jobTitle || j.positionTitle} (Stage: ${j.stage || j.status})`,
      date: j.createdAt || j.dateApplied,
      link: '/jobs'
    });
  }

  activities.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const recentActivities = activities.slice(0, 5);

  return {
    readinessScore,
    targetRole,
    readinessLabel,
    resumeScore,
    skillGapScore,
    studyProgress,
    interviewScore,
    timeEstimate,
    nextActions: finalNextActions,
    nextSteps: finalNextSteps,
    summary: {
      totalJobsApplied,
      interviews: interviewsScheduled,
      studyHoursLogged: studyHours,
      codesProblemsLogged
    },
    breakdown,
    chartStackedData,
    recommendations,
    recentActivities,
    // Backward compatibility fields
    totalReadiness: readinessScore,
    metrics: {
      activeInterviews: interviewsScheduled,
      appliedJobs: totalJobsApplied,
      totalTrackedJobs: totalJobsApplied,
      codingProblemsSolved: codesProblemsLogged,
      activeStudyPlanProgress: studyProgress
    },
    recentJobs
  };
};

module.exports = {
  calculateReadinessScore,
  getReadinessLabel
};
