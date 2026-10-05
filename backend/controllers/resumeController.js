// backend/controllers/resumeController.js
const { Resume } = require('../models');
const { extractTextFromPDF, extractSections } = require('../utils/pdfParser');
const {
  extractKeywords,
  matchKeywords,
  calculateMatchScore,
  findMissingKeywords,
  generateSuggestions,
  checkAtsReadiness,
  analyzeResumeAgainstJD
} = require('../utils/keywordMatcher');
const {
  analyzeResumeWithAI,
  generateImprovedResume
} = require('../utils/aiResumeAnalyzer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/resume/upload
 * Accept PDF file via multer and extract text using pdfjs-dist
 * Returns { id, fileName, uploadedAt }
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'FILE_REQUIRED',
        message: 'Please upload a valid PDF resume file.'
      });
    }

    // Extract text from uploaded PDF using pdfjs-dist
    let text = '';
    let numPages = 1;
    try {
      const parsed = await extractTextFromPDF(req.file.path);
      text = typeof parsed === 'string' ? parsed : (parsed.text || '');
      numPages = parsed.numPages || 1;
    } catch (parseErr) {
      if (fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        error: 'PDF_PARSE_FAILED',
        message: 'Failed to extract text from PDF file. Please ensure it is a valid, unencrypted PDF document.'
      });
    }

    const parsedSections = extractSections(text);
    const uploadedAt = new Date();

    // Save resume in database
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      uploadedAt,
      extractedText: text,
      parsedSections,
      analyses: [],
      targetRole: req.body.targetRole || req.user.targetRole || 'Fullstack Developer',
      atsScore: 0
    });

    res.status(201).json({
      success: true,
      id: resume.id,
      resumeId: resume.id,
      fileName: resume.fileName,
      uploadedAt: resume.uploadedAt,
      extractedText: text,
      numPages,
      fileUrl: resume.fileUrl,
      resume
    });
  } catch (error) {
    console.error('❌ [resumeController] uploadResume error:', error);
    next(error);
  }
};

/**
 * POST /api/resume/analyze
 * Body: { resumeId, jobDescription }
 * Extracts keywords, calculates match score, finds missing keywords, generates suggestions,
 * audits ATS readiness, persists to DB, and returns analysis object.
 */
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId, resumeText, jobDescription, jobTitle } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: 'JD_REQUIRED',
        message: 'Job description is required for analysis. Please paste the job requirements.'
      });
    }

    let targetResume = null;
    let textToAnalyze = resumeText ? resumeText.trim() : '';

    if (resumeId) {
      targetResume = await Resume.findOne({
        where: { id: resumeId, userId: req.user.id }
      });
    }

    if (!textToAnalyze && targetResume) {
      textToAnalyze = targetResume.extractedText || '';
    }

    // Fallback: use user's latest uploaded resume
    if (!textToAnalyze && !targetResume) {
      targetResume = await Resume.findOne({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      if (targetResume) {
        textToAnalyze = targetResume.extractedText || '';
      }
    }

    if (!textToAnalyze) {
      return res.status(400).json({
        success: false,
        error: 'RESUME_REQUIRED',
        message: 'Resume text or uploaded resume is required for analysis.'
      });
    }

    const title = jobTitle || (targetResume ? targetResume.targetRole : 'Target Role');

    // 1. Extract keywords
    const resumeKeywords = extractKeywords(textToAnalyze);
    const jdKeywords = extractKeywords(jobDescription.trim());

    // 2. Match keywords & calculate match score
    const matchingKeywords = matchKeywords(resumeKeywords, jdKeywords);
    const matchScore = calculateMatchScore(matchingKeywords.length, jdKeywords.length || 1);

    // 3. Find missing keywords
    const missingKeywords = findMissingKeywords(resumeKeywords, jdKeywords, jobDescription.trim());

    // 4. Generate actionable suggestions
    const suggestions = generateSuggestions(missingKeywords, textToAnalyze);

    // 5. Check ATS readiness
    const atsAudit = checkAtsReadiness(textToAnalyze);
    const atsReady = {
      hasContact: atsAudit.hasContactInfo,
      hasSkills: atsAudit.hasSkillsSection,
      hasExperience: atsAudit.hasExperienceSection,
      hasEducation: atsAudit.hasEducationSection,
      hasProjects: atsAudit.hasProjectsSection
    };

    const createdAt = new Date().toISOString();

    // 6. Structure analysis record
    const analysisRecord = {
      id: uuidv4(),
      jobTitle: title,
      jobDescription: jobDescription.trim(),
      matchScore: Math.round(matchScore),
      rawScore: matchScore,
      missingKeywords,
      matchingKeywords,
      totalJDKeywords: jdKeywords.length,
      matchingCount: matchingKeywords.length,
      suggestions,
      atsReady,
      atsReadiness: atsAudit,
      createdAt,
      analyzedAt: createdAt
    };

    // 7. Save analysis to database
    if (targetResume) {
      const currentAnalyses = Array.isArray(targetResume.analyses) ? targetResume.analyses : [];
      targetResume.analyses = [analysisRecord, ...currentAnalyses];
      targetResume.atsScore = Math.round(matchScore);
      targetResume.targetRole = title;
      targetResume.matchedKeywords = matchingKeywords;
      targetResume.missingKeywords = missingKeywords;
      targetResume.suggestions = suggestions;
      await targetResume.save();
    } else {
      targetResume = await Resume.create({
        userId: req.user.id,
        fileName: 'Pasted Resume Text',
        originalName: 'Pasted Resume Text',
        filePath: '',
        fileSize: 0,
        uploadedAt: new Date(),
        extractedText: textToAnalyze,
        analyses: [analysisRecord],
        targetRole: title,
        atsScore: Math.round(matchScore),
        matchedKeywords: matchingKeywords,
        missingKeywords: missingKeywords,
        suggestions: suggestions
      });
    }

    res.json({
      success: true,
      matchScore: Math.round(matchScore),
      missingKeywords,
      matchingKeywords,
      suggestions,
      atsReady,
      atsReadiness: atsAudit,
      createdAt,
      analysis: analysisRecord,
      resumeId: targetResume.id
    });
  } catch (error) {
    console.error('❌ [resumeController] analyzeResume error:', error);
    next(error);
  }
};

/**
 * GET /api/resume/history
 * Query all resumes for user with all analyses, sort by uploadedAt (newest first)
 * Returns array of resumes with analyses
 */
const getHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [['uploadedAt', 'DESC'], ['createdAt', 'DESC']],
      attributes: { exclude: ['extractedText'] }
    });

    const historyList = [];

    for (const resume of resumes) {
      const analyses = Array.isArray(resume.analyses) ? resume.analyses : [];

      if (analyses.length > 0) {
        for (const item of analyses) {
          historyList.push({
            id: item.id || `${resume.id}-${item.analyzedAt || item.createdAt}`,
            resumeId: resume.id,
            fileName: resume.fileName || resume.originalName,
            jobTitle: item.jobTitle || resume.targetRole || 'Target Role',
            jobDescription: item.jobDescription || '',
            matchScore: item.matchScore !== undefined ? item.matchScore : Math.round(resume.atsScore || 0),
            missingKeywords: item.missingKeywords || resume.missingKeywords || [],
            matchingKeywords: item.matchingKeywords || resume.matchedKeywords || [],
            suggestions: item.suggestions || resume.suggestions || [],
            atsReady: item.atsReady || {
              hasContact: true,
              hasSkills: true,
              hasExperience: true,
              hasEducation: true
            },
            atsReadiness: item.atsReadiness || {
              hasContactInfo: true,
              hasSkillsSection: true,
              hasExperienceSection: true,
              hasEducationSection: true,
              tips: []
            },
            analyzedAt: item.analyzedAt || item.createdAt || resume.updatedAt,
            uploadedAt: resume.uploadedAt || resume.createdAt
          });
        }
      } else if (resume.atsScore > 0 || (resume.matchedKeywords && resume.matchedKeywords.length > 0)) {
        historyList.push({
          id: resume.id,
          resumeId: resume.id,
          fileName: resume.fileName || resume.originalName,
          jobTitle: resume.targetRole || 'Target Role',
          jobDescription: '',
          matchScore: Math.round(resume.atsScore || 0),
          missingKeywords: resume.missingKeywords || [],
          matchingKeywords: resume.matchedKeywords || [],
          suggestions: resume.suggestions || [],
          atsReady: {
            hasContact: true,
            hasSkills: true,
            hasExperience: true,
            hasEducation: true
          },
          atsReadiness: {
            hasContactInfo: true,
            hasSkillsSection: true,
            hasExperienceSection: true,
            hasEducationSection: true,
            tips: []
          },
          analyzedAt: resume.updatedAt || resume.createdAt,
          uploadedAt: resume.uploadedAt || resume.createdAt
        });
      }
    }

    historyList.sort((a, b) => new Date(b.analyzedAt || b.uploadedAt) - new Date(a.analyzedAt || a.uploadedAt));

    res.json({
      success: true,
      resumes,
      history: historyList,
      total: historyList.length
    });
  } catch (error) {
    console.error('❌ [resumeController] getHistory error:', error);
    next(error);
  }
};

/**
 * GET /api/resume/:id
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Resume not found.' });
    }

    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resume/:id
 * Delete resume from DB and disk
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Resume not found.' });
    }

    if (resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.warn('⚠️ Could not remove file:', err.message);
      }
    }

    await resume.destroy();

    res.json({ success: true, message: 'Resume and associated analyses deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resume/history/:analysisId
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const { analysisId } = req.params;
    const resumes = await Resume.findAll({ where: { userId: req.user.id } });

    let found = false;
    for (const resume of resumes) {
      const analyses = Array.isArray(resume.analyses) ? resume.analyses : [];
      const updatedAnalyses = analyses.filter(a => a.id !== analysisId);
      if (updatedAnalyses.length !== analyses.length) {
        resume.analyses = updatedAnalyses;
        await resume.save();
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Analysis record not found.' });
    }

    res.json({ success: true, message: 'Analysis entry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/resume/:id/ai-feedback
 * Generates structured AI resume feedback using Google Gemini API
 * Caches feedback for up to 30 days unless forceRefresh is specified
 */
const generateAIFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Resume ID parameter is required.'
      });
    }

    const resume = await Resume.findOne({
      where: { id: resumeId, userId }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Resume not found.'
      });
    }

    // Check if valid feedback already exists and is recent (< 30 days)
    const existingFeedback = resume.aiFeedback || resume.ai_feedback;
    const feedbackDate = resume.aiFeedbackGeneratedAt || resume.ai_feedback_generated_at;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const isRecent = feedbackDate && new Date(feedbackDate) > thirtyDaysAgo;

    if (existingFeedback && isRecent && !req.body?.forceRefresh) {
      return res.json({
        success: true,
        data: existingFeedback,
        cached: true
      });
    }

    // Get text content: from extractedText or fallback to reading PDF
    let resumeText = (resume.extractedText || '').trim();

    if (!resumeText && resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        const parsed = await extractTextFromPDF(resume.filePath);
        resumeText = (typeof parsed === 'string' ? parsed : (parsed.text || '')).trim();
        if (resumeText) {
          resume.extractedText = resumeText;
        }
      } catch (parseErr) {
        console.error('❌ [generateAIFeedback] PDF parse error:', parseErr.message);
      }
    }

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'TEXT_EXTRACTION_FAILED',
        message: 'Could not extract sufficient text from resume PDF for AI analysis. Please verify your PDF file.'
      });
    }

    // Call Gemini AI analyzer
    const feedback = await analyzeResumeWithAI(resumeText);

    // Save to database
    resume.aiFeedback = feedback;
    resume.aiScore = feedback.overallScore || 0;
    resume.aiFeedbackGeneratedAt = new Date();
    await resume.save();

    return res.json({
      success: true,
      data: feedback,
      cached: false
    });
  } catch (error) {
    console.error('❌ [resumeController] generateAIFeedback error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.code || 'AI_FEEDBACK_ERROR',
      message: error.message || 'An error occurred while generating AI resume feedback.'
    });
  }
};

/**
 * GET /api/resume/:id/ai-feedback
 * Retrieves stored AI feedback for the specified resume
 */
const getAIFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const resume = await Resume.findOne({
      where: { id: resumeId, userId }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Resume not found.'
      });
    }

    let feedback = resume.aiFeedback || resume.ai_feedback;
    if (typeof feedback === 'string') {
      try {
        feedback = JSON.parse(feedback);
      } catch (e) {}
    }

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'No AI feedback found for this resume. Please generate feedback first.'
      });
    }

    return res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('❌ [resumeController] getAIFeedback error:', error.message);
    next(error);
  }
};

/**
 * GET /api/resume/:id/improved
 * Retrieves or generates an AI-improved rewritten resume
 */
const getImprovedResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const resume = await Resume.findOne({
      where: { id: resumeId, userId }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Resume not found.'
      });
    }

    // Return cached improved resume if already generated and force is not set
    const existingImproved = resume.aiImprovedResume || resume.ai_improved_resume;
    if (existingImproved && !req.query?.refresh) {
      return res.json({
        success: true,
        data: {
          improvedResume: existingImproved
        }
      });
    }

    // Need AI feedback first
    const feedback = resume.aiFeedback || resume.ai_feedback;
    if (!feedback) {
      return res.status(400).json({
        success: false,
        error: 'FEEDBACK_REQUIRED',
        message: 'Please generate AI feedback first before generating an improved resume.'
      });
    }

    let resumeText = (resume.extractedText || '').trim();
    if (!resumeText && resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        const parsed = await extractTextFromPDF(resume.filePath);
        resumeText = (typeof parsed === 'string' ? parsed : (parsed.text || '')).trim();
      } catch (e) {}
    }

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        error: 'RESUME_TEXT_MISSING',
        message: 'Resume content is unavailable for rewriting.'
      });
    }

    const improvedResume = await generateImprovedResume(resumeText, feedback);

    resume.aiImprovedResume = improvedResume;
    await resume.save();

    return res.json({
      success: true,
      data: {
        improvedResume
      }
    });
  } catch (error) {
    console.error('❌ [resumeController] getImprovedResume error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.code || 'IMPROVED_RESUME_ERROR',
      message: error.message || 'Failed to generate improved resume.'
    });
  }
};

/**
 * GET /api/resume/:id/improved/download
 * Downloads the AI improved resume as a plain text attachment
 */
const downloadImprovedResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const resume = await Resume.findOne({
      where: { id: resumeId, userId }
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Resume not found.'
      });
    }

    let improvedResume = resume.aiImprovedResume || resume.ai_improved_resume;

    // If not generated yet, try to generate it if feedback exists
    if (!improvedResume) {
      const feedback = resume.aiFeedback || resume.ai_feedback;
      if (!feedback) {
        return res.status(400).json({
          success: false,
          error: 'FEEDBACK_REQUIRED',
          message: 'Please generate AI feedback first before downloading improved resume.'
        });
      }

      let resumeText = (resume.extractedText || '').trim();
      if (!resumeText && resume.filePath && fs.existsSync(resume.filePath)) {
        const parsed = await extractTextFromPDF(resume.filePath);
        resumeText = (typeof parsed === 'string' ? parsed : (parsed.text || '')).trim();
      }

      improvedResume = await generateImprovedResume(resumeText, feedback);
      resume.aiImprovedResume = improvedResume;
      await resume.save();
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="improved-resume.txt"');
    return res.send(improvedResume);
  } catch (error) {
    console.error('❌ [resumeController] downloadImprovedResume error:', error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.code || 'DOWNLOAD_ERROR',
      message: error.message || 'Failed to download improved resume.'
    });
  }
};

module.exports = {
  uploadResume,
  analyzeResume,
  getHistory,
  getResumeHistory: getHistory,
  getResumeById,
  deleteResume,
  deleteAnalysis,
  generateAIFeedback,
  getAIFeedback,
  getImprovedResume,
  downloadImprovedResume
};
