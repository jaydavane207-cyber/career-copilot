// backend/utils/pdfParser.js
const fs = require('fs');

/**
 * Extracts raw text and page count from a PDF file using pdfjs-dist
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<{ success: boolean, text: string, numPages: number, info: object }>}
 */
const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    // Load pdfjs-dist legacy build for Node.js compatibility
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Read the binary buffer from disk
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    // Initialize PDF loading task
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    let fullText = '';

    // Iterate through all pages in the PDF document
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      let pageLines = '';
      for (const item of textContent.items) {
        if (!item.str) continue;
        // Check for end-of-line flag or add word separation
        pageLines += item.str + (item.hasEOL ? '\n' : ' ');
      }

      fullText += pageLines.trim() + '\n\n';
    }

    const cleanedText = fullText.trim();

    return {
      success: true,
      text: cleanedText,
      numPages,
      info: {}
    };
  } catch (error) {
    console.error('❌ [pdfParser] Error reading PDF file with pdfjs-dist:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Parses raw resume text into key standard sections
 * @param {string} text - Raw extracted resume text
 * @returns {object} Identified sections
 */
const extractSections = (text = '') => {
  const sections = {
    contactInfo: '',
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
    if (lower.match(/\b(experience|employment history|work experience|professional experience)\b/)) {
      currentSection = 'experience';
      continue;
    } else if (lower.match(/\b(education|academic background|degree|university|college)\b/)) {
      currentSection = 'education';
      continue;
    } else if (lower.match(/\b(skills|technical skills|technologies|core competencies|tech stack)\b/)) {
      currentSection = 'skills';
      continue;
    } else if (lower.match(/\b(projects|personal projects|key projects)\b/)) {
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
