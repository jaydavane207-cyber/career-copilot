// frontend/src/utils/pdfReport.js
import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional PDF analysis report
 * @param {object} analysis - The resume analysis result object
 * @param {string} fileName - Original resume file name
 */
export const downloadAnalysisPDF = (analysis, fileName = 'Resume') => {
  if (!analysis) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = 18;

  // Primary brand colors
  const primaryColor = [79, 70, 229]; // Indigo #4F46E5
  const darkTextColor = [30, 41, 59]; // Slate #1E293B
  const mutedTextColor = [100, 116, 139]; // Slate #64748B
  const roseColor = [225, 29, 72]; // Rose #E11D48
  const emeraldColor = [16, 185, 129]; // Emerald #10B981

  // Top header banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...darkTextColor);
  doc.text('Career Copilot — Resume ATS Analysis', margin, currentY);
  currentY += 6;

  // Subtitle / Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  const formattedDate = new Date(analysis.analyzedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated on: ${formattedDate} | Target Role: ${analysis.jobTitle || 'Fullstack Engineer'}`, margin, currentY);
  currentY += 8;

  // Separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- Score Summary Card ---
  const cardHeight = 26;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), cardHeight, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), cardHeight, 3, 3, 'S');

  // Match score inside card
  const score = analysis.matchScore || 0;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  if (score >= 75) {
    doc.setTextColor(...emeraldColor);
  } else if (score >= 50) {
    doc.setTextColor(217, 119, 6); // Amber
  } else {
    doc.setTextColor(...roseColor);
  }
  doc.text(`${score}%`, margin + 8, currentY + 14);

  doc.setFontSize(8);
  doc.setTextColor(...mutedTextColor);
  doc.setFont('helvetica', 'bold');
  doc.text('MATCH SCORE', margin + 8, currentY + 20);

  // Resume Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(`Resume File: ${fileName || 'Uploaded PDF'}`, margin + 45, currentY + 10);
  doc.text(`Matched Skills: ${analysis.matchingKeywords?.length || 0} skills identified`, margin + 45, currentY + 16);
  doc.text(`Missing Keywords: ${analysis.missingKeywords?.length || 0} skills needed`, margin + 45, currentY + 22);

  currentY += cardHeight + 10;

  // --- Missing Keywords Section ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...roseColor);
  doc.text(`Missing Target Keywords (${analysis.missingKeywords?.length || 0})`, margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);

  if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
    const missingText = analysis.missingKeywords.join('  •  ');
    const splitMissing = doc.splitTextToSize(missingText, pageWidth - (margin * 2));
    doc.text(splitMissing, margin, currentY);
    currentY += (splitMissing.length * 5) + 6;
  } else {
    doc.text('None! Your resume covers all key job requirements.', margin, currentY);
    currentY += 8;
  }

  // --- Matching Keywords Section ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...emeraldColor);
  doc.text(`Matched Keywords (${analysis.matchingKeywords?.length || 0})`, margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);

  if (analysis.matchingKeywords && analysis.matchingKeywords.length > 0) {
    const matchedText = analysis.matchingKeywords.join('  •  ');
    const splitMatched = doc.splitTextToSize(matchedText, pageWidth - (margin * 2));
    doc.text(splitMatched, margin, currentY);
    currentY += (splitMatched.length * 5) + 6;
  } else {
    doc.text('No matching technical keywords found.', margin, currentY);
    currentY += 8;
  }

  // --- Actionable Suggestions Section ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('Actionable Suggestions', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);

  if (analysis.suggestions && analysis.suggestions.length > 0) {
    analysis.suggestions.forEach((suggestion, index) => {
      const itemText = `${index + 1}. ${suggestion}`;
      const splitItem = doc.splitTextToSize(itemText, pageWidth - (margin * 2));
      doc.text(splitItem, margin, currentY);
      currentY += (splitItem.length * 4.5) + 2;
    });
    currentY += 4;
  }

  // --- ATS Readiness Checklist ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkTextColor);
  doc.text('ATS Readiness Checklist', margin, currentY);
  currentY += 6;

  doc.setFontSize(9);
  const ats = analysis.atsReadiness || {};

  const checklistItems = [
    { label: 'Contact Info (Email / Phone)', pass: !!ats.hasContactInfo },
    { label: 'Skills / Technical Stack Section', pass: !!ats.hasSkillsSection },
    { label: 'Experience / Work History Section', pass: !!ats.hasExperienceSection },
    { label: 'Education / Academic Credentials', pass: ats.hasEducationSection !== false }
  ];

  checklistItems.forEach((item) => {
    if (item.pass) {
      doc.setTextColor(...emeraldColor);
      doc.text('✓', margin, currentY);
    } else {
      doc.setTextColor(...roseColor);
      doc.text('✗', margin, currentY);
    }
    doc.setTextColor(...darkTextColor);
    doc.text(item.label, margin + 6, currentY);
    currentY += 5;
  });
  currentY += 3;

  // ATS Tips
  if (ats.tips && ats.tips.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...mutedTextColor);
    doc.text('Optimization Tips:', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    ats.tips.forEach((tip) => {
      const splitTip = doc.splitTextToSize(`• ${tip}`, pageWidth - (margin * 2));
      doc.text(splitTip, margin, currentY);
      currentY += (splitTip.length * 4) + 1.5;
    });
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedTextColor);
  doc.text(
    'Career Copilot — Smart AI Career & ATS Optimization Platform',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Trigger download
  const safeTitle = (analysis.jobTitle || 'Analysis').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Resume_Analysis_${safeTitle}.pdf`);
};

export default downloadAnalysisPDF;
