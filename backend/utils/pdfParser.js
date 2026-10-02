// backend/utils/pdfParser.js
const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const rawText = pdfData.text || '';

    return {
      success: true,
      text: rawText.trim(),
      numpages: pdfData.numpages,
      info: pdfData.info
    };
  } catch (error) {
    console.error('❌ [pdfParser] Error reading PDF file:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

const extractSections = (text) => {
  const sections = {
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  };

  if (!text) return sections;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentSection = 'summary';
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('experience') || lower.includes('employment') || lower.includes('work history')) {
      currentSection = 'experience';
      continue;
    } else if (lower.includes('education') || lower.includes('academic') || lower.includes('degrees')) {
      currentSection = 'education';
      continue;
    } else if (lower.includes('skill') || lower.includes('technologies') || lower.includes('competencies')) {
      currentSection = 'skills';
      continue;
    } else if (lower.includes('project') || lower.includes('portfolio')) {
      currentSection = 'projects';
      continue;
    }

    if (currentSection === 'summary') {
      sections.summary += (sections.summary ? ' ' : '') + line;
    } else if (Array.isArray(sections[currentSection])) {
      sections[currentSection].push(line);
    }
  }

  return sections;
};

module.exports = {
  extractTextFromPDF,
  extractSections
};
