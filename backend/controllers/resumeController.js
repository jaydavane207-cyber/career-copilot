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

module.exports = {
  uploadResume,
  analyzeResume,
  getHistory,
  getResumeHistory: getHistory,
  getResumeById,
  deleteResume,
  deleteAnalysis
};
