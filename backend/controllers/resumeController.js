// backend/controllers/resumeController.js
const { Resume } = require('../models');
const { extractTextFromPDF, extractSections } = require('../utils/pdfParser');
const { analyzeResumeMatch } = require('../utils/keywordMatcher');
const fs = require('fs');

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid PDF resume file.' });
    }

    const targetRole = req.body.targetRole || req.user.targetRole || 'Fullstack Developer';

    // Parse PDF
    const { text } = await extractTextFromPDF(req.file.path);
    const parsedSections = extractSections(text);
    const analysis = analyzeResumeMatch(text, targetRole);

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      extractedText: text,
      parsedSections,
      targetRole: analysis.targetRole,
      atsScore: analysis.atsScore,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resume
    });
  } catch (error) {
    next(error);
  }
};

const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId, targetRole } = req.body;

    const resume = await Resume.findOne({
      where: { id: resumeId, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const roleToCompare = targetRole || resume.targetRole || req.user.targetRole;
    const analysis = analyzeResumeMatch(resume.extractedText, roleToCompare);

    resume.targetRole = analysis.targetRole;
    resume.atsScore = analysis.atsScore;
    resume.matchedKeywords = analysis.matchedKeywords;
    resume.missingKeywords = analysis.missingKeywords;
    resume.suggestions = analysis.suggestions;
    await resume.save();

    res.json({
      success: true,
      message: 'Resume re-analyzed successfully',
      analysis,
      resume
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['extractedText'] }
    });

    res.json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

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

const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    // Try deleting file from disk
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await resume.destroy();

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  analyzeResume,
  getHistory,
  getResumeById,
  deleteResume
};
