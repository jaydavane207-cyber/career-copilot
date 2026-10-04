// frontend/src/utils/interviewPdfReport.js
import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional PDF report of a completed mock interview session
 * @param {object} session - The interview session or evaluation result object
 */
export const downloadInterviewPDF = (session) => {
  if (!session) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = 18;

  // Colors
  const primaryColor = [79, 70, 229]; // Indigo #4F46E5
  const darkTextColor = [30, 41, 59]; // Slate #1E293B
  const mutedTextColor = [100, 116, 139]; // Slate #64748B
  const emeraldColor = [16, 185, 129]; // Emerald #10B981
  const amberColor = [217, 119, 6]; // Amber #D97706
  const bgCardColor = [248, 250, 252]; // Slate-50

  const checkPageBreak = (neededHeight) => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      currentY = 18;
      // Top accent banner on new page
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 4, 'F');
    }
  };

  // Top header accent line
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...darkTextColor);
  doc.text('Career Copilot — Mock Interview Performance Report', margin, currentY);
  currentY += 6;

  // Subtitle / Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  const formattedDate = new Date(session.completedAt || session.date || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Track: ${session.interviewType || 'General'} | Target Role: ${session.role || 'Software Engineer'} | Generated: ${formattedDate}`, margin, currentY);
  currentY += 7;

  // Separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- Summary Metrics Card ---
  const cardHeight = 24;
  doc.setFillColor(...bgCardColor);
  doc.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, cardHeight, 3, 3, 'S');

  const stats = session.sessionStats || {};
  const answersList = session.answers || session.questions || [];
  const totalQuestions = stats.totalQuestions || answersList.length || 0;
  const timeSpentSec = stats.timeSpent || 0;
  const timeFormatted = timeSpentSec ? `${Math.floor(timeSpentSec / 60)}m ${timeSpentSec % 60}s` : '10m';
  const avgConf = stats.avgConfidence !== undefined ? stats.avgConfidence : '4.0';
  const score = session.overallScore || 0;

  // Column 1: Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...(score >= 75 ? emeraldColor : score >= 50 ? amberColor : primaryColor));
  doc.text(`${score}%`, margin + 8, currentY + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('EVALUATION SCORE', margin + 8, currentY + 18);

  // Column 2: Avg Confidence
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...darkTextColor);
  doc.text(`${avgConf} / 5.0 ★`, margin + 50, currentY + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('AVG CONFIDENCE', margin + 50, currentY + 18);

  // Column 3: Questions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...darkTextColor);
  doc.text(`${totalQuestions} Questions`, margin + 100, currentY + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('PRACTICE COUNT', margin + 100, currentY + 18);

  // Column 4: Time Spent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...darkTextColor);
  doc.text(timeFormatted, margin + 145, currentY + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('TIME SPENT', margin + 145, currentY + 18);

  currentY += cardHeight + 9;

  // Feedback summary if present
  if (session.feedbackSummary) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('Coach Summary & Overall Feedback:', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);
    const splitSummary = doc.splitTextToSize(session.feedbackSummary, contentWidth);
    doc.text(splitSummary, margin, currentY);
    currentY += (splitSummary.length * 4) + 6;
  }

  // --- Questions & Answers Loop ---
  answersList.forEach((q, index) => {
    checkPageBreak(35);

    // Question Header Box
    doc.setFillColor(238, 242, 255); // Indigo-50
    doc.roundedRect(margin, currentY, contentWidth, 7, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    const confidenceText = q.confidence ? ` | Confidence: ${q.confidence}/5 ★` : '';
    const categoryText = q.category ? ` [${q.category}]` : '';
    doc.text(`Q${index + 1}: ${categoryText}${confidenceText}`, margin + 3, currentY + 4.8);
    currentY += 10;

    // Question Prompt
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkTextColor);
    const splitQText = doc.splitTextToSize(q.question || '', contentWidth);
    doc.text(splitQText, margin, currentY);
    currentY += (splitQText.length * 4.5) + 3;

    // User's Response
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...mutedTextColor);
    doc.text('YOUR RESPONSE:', margin, currentY);
    currentY += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);
    const userAns = q.userAnswer || q.userResponse || '(No response provided)';
    const splitUserAns = doc.splitTextToSize(userAns, contentWidth);
    doc.text(splitUserAns, margin, currentY);
    currentY += (splitUserAns.length * 4) + 4;

    // Sample Answer Highlights
    const sample = q.sampleAnswer || {};
    if (sample.strongAnswer) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...emeraldColor);
      doc.text('STRONG ANSWER MODEL:', margin, currentY);
      currentY += 3.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const splitStrong = doc.splitTextToSize(sample.strongAnswer, contentWidth);
      doc.text(splitStrong, margin, currentY);
      currentY += (splitStrong.length * 3.8) + 3;
    }

    // Key points checklist
    if (sample.keyPoints && sample.keyPoints.length > 0) {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...mutedTextColor);
      doc.text('KEY CONCEPTS TO HIT:', margin, currentY);
      currentY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...darkTextColor);
      sample.keyPoints.forEach(point => {
        const splitPoint = doc.splitTextToSize(`• ${point}`, contentWidth);
        doc.text(splitPoint, margin, currentY);
        currentY += (splitPoint.length * 3.4) + 1;
      });
      currentY += 2;
    }

    // Coaching Tips
    if (sample.tips) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...amberColor);
      doc.text('COACHING TIP:', margin, currentY);
      currentY += 3.2;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const splitTip = doc.splitTextToSize(sample.tips, contentWidth);
      doc.text(splitTip, margin, currentY);
      currentY += (splitTip.length * 3.4) + 3;
    }

    // Bottom item divider
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;
  });

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(
      'Career Copilot — Smart AI Interview Simulator & ATS Preparation',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Trigger download
  const safeTrack = (session.interviewType || 'Interview').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`CareerCopilot_MockInterview_${safeTrack}_${Date.now()}.pdf`);
};

export default downloadInterviewPDF;
