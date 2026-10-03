// backend/controllers/resumeController.js
const { Resume } = require('../models');
const { extractTextFromPDF, extractSections } = require('../utils/pdfParser');
const { analyzeResumeAgainstJD, analyzeResumeMatch } = require('../utils/keywordMatcher');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/resume/upload
 * Accept PDF file via multer and extract text using pdfjs-dist
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid PDF resume file.'
      });
    }

    // Extract text from uploaded PDF using pdfjs-dist
    let text = '';
    let numPages = 1;
    try {
      const parsed = await extractTextFromPDF(req.file.path);
      text = parsed.text;
      numPages = parsed.numPages;
    } catch (parseErr) {
      if (fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message: 'Failed to extract text from PDF file. Please ensure it is a valid, unencrypted PDF document.'
      });
    }

    const parsedSections = extractSections(text);

    // Save resume in database
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      extractedText: text,
      parsedSections,
      analyses: [],
      targetRole: req.body.targetRole || req.user.targetRole || 'Fullstack Developer',
      atsScore: 0
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and text extracted successfully.',
      resumeId: resume.id,
      fileName: resume.fileName,
      extractedText: text,
      numPages,
      resume
    });
  } catch (error) {
    console.error('❌ [resumeController] uploadResume error:', error);
    next(error);
  }
};

/**
 * POST /api/resume/analyze
 * Take resume text + job description, return keyword match & ATS analysis
 */
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId, resumeText, jobDescription, jobTitle } = req.body;

    let targetResume = null;
    let textToAnalyze = resumeText ? resumeText.trim() : '';

    // If resumeId is provided, fetch resume from DB
    if (resumeId) {
      targetResume = await Resume.findOne({
        where: { id: resumeId, userId: req.user.id }
      });
    }

    // If resumeText was not provided directly in body, use stored extractedText
    if (!textToAnalyze && targetResume) {
      textToAnalyze = targetResume.extractedText || '';
    }

    // If still no resume, find user's latest uploaded resume
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
        message: 'Resume text is required for analysis. Please upload your resume PDF first.'
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required for analysis. Please paste the job requirements.'
      });
    }

    const title = jobTitle || (targetResume ? targetResume.targetRole : 'Target Role');

    // Run core matching and ATS audit logic
    const analysisResult = analyzeResumeAgainstJD(textToAnalyze, jobDescription.trim(), title);

    // Structure single analysis record
    const analysisRecord = {
      id: uuidv4(),
      jobTitle: title,
      jobDescription: jobDescription.trim(),
      matchScore: analysisResult.matchScore,
      missingKeywords: analysisResult.missingKeywords,
      matchingKeywords: analysisResult.matchingKeywords,
      totalJDKeywords: analysisResult.totalJDKeywords,
      matchingCount: analysisResult.matchingCount,
      suggestions: analysisResult.suggestions,
      atsReadiness: analysisResult.atsReadiness,
      analyzedAt: new Date().toISOString()
    };

    // If resume found or created, append analysis record to analyses[]
    if (targetResume) {
      const currentAnalyses = Array.isArray(targetResume.analyses) ? targetResume.analyses : [];
      targetResume.analyses = [analysisRecord, ...currentAnalyses];
      targetResume.atsScore = analysisResult.matchScore;
      targetResume.targetRole = title;
      targetResume.matchedKeywords = analysisResult.matchingKeywords;
      targetResume.missingKeywords = analysisResult.missingKeywords;
      targetResume.suggestions = analysisResult.suggestions;
      await targetResume.save();
    } else {
      // Create a new resume record to store this analysis
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
        atsScore: analysisResult.matchScore,
        matchedKeywords: analysisResult.matchingKeywords,
        missingKeywords: analysisResult.missingKeywords,
        suggestions: analysisResult.suggestions
      });
    }

    res.json({
      success: true,
      message: 'Resume analysis completed successfully.',
      matchScore: analysisResult.matchScore,
      missingKeywords: analysisResult.missingKeywords,
      matchingKeywords: analysisResult.matchingKeywords,
      suggestions: analysisResult.suggestions,
      atsReadiness: analysisResult.atsReadiness,
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
 * Get user's past resume analyses with timestamps and metrics
 */
const getHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['extractedText'] }
    });

    // Flatten all past analyses into a historical list sorted by date
    const historyList = [];

    for (const resume of resumes) {
      const analyses = Array.isArray(resume.analyses) ? resume.analyses : [];

      if (analyses.length > 0) {
        for (const item of analyses) {
          historyList.push({
            id: item.id || `${resume.id}-${item.analyzedAt}`,
            resumeId: resume.id,
            fileName: resume.fileName || resume.originalName,
            jobTitle: item.jobTitle || resume.targetRole || 'Target Role',
            jobDescription: item.jobDescription || '',
            matchScore: item.matchScore !== undefined ? item.matchScore : Math.round(resume.atsScore || 0),
            missingKeywords: item.missingKeywords || resume.missingKeywords || [],
            matchingKeywords: item.matchingKeywords || resume.matchedKeywords || [],
            suggestions: item.suggestions || resume.suggestions || [],
            atsReadiness: item.atsReadiness || {
              hasContactInfo: true,
              hasSkillsSection: true,
              hasExperienceSection: true,
              tips: []
            },
            analyzedAt: item.analyzedAt || resume.updatedAt || resume.createdAt,
            uploadedAt: resume.uploadedAt || resume.createdAt
          });
        }
      } else if (resume.atsScore > 0 || (resume.matchedKeywords && resume.matchedKeywords.length > 0)) {
        // Fallback for resumes uploaded before analyses array
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
          atsReadiness: {
            hasContactInfo: true,
            hasSkillsSection: true,
            hasExperienceSection: true,
            tips: []
          },
          analyzedAt: resume.updatedAt || resume.createdAt,
          uploadedAt: resume.uploadedAt || resume.createdAt
        });
      }
    }

    // Sort by most recent analysis date
    historyList.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));

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
 * Get resume details by ID
 */
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resume/:id
 * Delete a resume and its stored file
 */
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    // Delete file from disk if exists
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.warn('⚠️ Could not remove file:', err.message);
      }
    }

    await resume.destroy();

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resume/history/:analysisId
 * Delete an individual analysis record from history
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const { analysisId } = req.params;

    const resumes = await Resume.findAll({
      where: { userId: req.user.id }
    });

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
      return res.status(404).json({ success: false, message: 'Analysis record not found.' });
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
  getResumeById,
  deleteResume,
  deleteAnalysis
};
