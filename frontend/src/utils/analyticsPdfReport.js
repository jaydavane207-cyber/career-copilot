// frontend/src/utils/analyticsPdfReport.js
import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional Career Analytics Executive PDF Report
 */
export const downloadAnalyticsPDF = (dashboardData, candidateName = 'Candidate') => {
  if (!dashboardData) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  const primaryColor = [79, 70, 229]; // Indigo
  const darkTextColor = [30, 41, 59]; // Slate 800
  const mutedTextColor = [100, 116, 139]; // Slate 500
  const emeraldColor = [16, 185, 129];
  const roseColor = [225, 29, 72];

  // Top header accent line
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...darkTextColor);
  doc.text('Career Copilot — Executive Career Analytics Report', margin, currentY);
  currentY += 6;

  // Metadata subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  doc.text(`Candidate: ${candidateName} | Target: Software Engineer | Date: ${formattedDate}`, margin, currentY);
  currentY += 8;

  // Separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // Section 1: Executive Key Metrics Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text('1. Executive Performance Metrics', margin, currentY);
  currentY += 6;

  const funnel = dashboardData.funnel || {};
  const salary = dashboardData.salary || {};
  const study = dashboardData.study || {};

  const cardWidth = (pageWidth - margin * 2 - 9) / 4;
  const metrics = [
    { title: 'Offer Rate', val: `${funnel.overall_offer_rate || 6.7}%`, sub: `Platform: ${funnel.platform_avg_offer_rate || 8.2}%` },
    { title: 'Avg Final Salary', val: `$${(salary.avg_final_offer || 180000).toLocaleString()}`, sub: `+${salary.negotiation_percentage || 9.1}% gain` },
    { title: 'Study Hours', val: `${study.total_hours || 126} hrs`, sub: `Readiness: ${study.current_readiness || 78}%` },
    { title: 'Interview Success', val: '45.0%', sub: 'Target: 60.0%' }
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, cardWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(m.title, x + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkTextColor);
    doc.text(m.val, x + 3, currentY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...primaryColor);
    doc.text(m.sub, x + 3, currentY + 15.5);
  });
  currentY += 24;

  // Section 2: Application Funnel Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text('2. Job Application Pipeline Funnel', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  const f = funnel.funnel || { applied: 15, phone_screen: 8, technical: 4, offer: 1 };
  const cr = funnel.conversion_rates || { to_phone_screen: 53, to_technical: 50, to_offer: 25 };

  doc.text(`• Applied: ${f.applied} applications submitted`, margin + 3, currentY); currentY += 5;
  doc.text(`• Phone Screen: ${f.phone_screen} calls (${cr.to_phone_screen}% conversion)`, margin + 3, currentY); currentY += 5;
  doc.text(`• Technical Round: ${f.technical} rounds (${cr.to_technical}% conversion) — [Primary Bottleneck]`, margin + 3, currentY); currentY += 5;
  doc.text(`• Offers Received: ${f.offer} written offers (${cr.to_offer}% conversion to offer)`, margin + 3, currentY); currentY += 8;

  // Section 3: Skill Performance & ROI
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text('3. Skill Performance & Preparation ROI', margin, currentY);
  currentY += 6;

  const skillsList = (dashboardData.skills?.skills || []).slice(0, 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkTextColor);
  doc.text('Skill', margin + 2, currentY);
  doc.text('User Success', margin + 60, currentY);
  doc.text('Platform Benchmark', margin + 95, currentY);
  doc.text('Salary Impact', margin + 140, currentY);
  currentY += 4;

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 4;

  skillsList.forEach((s) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkTextColor);
    doc.text(s.skill, margin + 2, currentY);
    doc.text(`${s.success_rate}%`, margin + 60, currentY);
    doc.text(`${s.platform_avg_success}%`, margin + 95, currentY);
    doc.text(`+$${(s.estimated_salary_impact || 0).toLocaleString()}`, margin + 140, currentY);
    currentY += 5;
  });
  currentY += 6;

  // Section 4: Prioritized Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text('4. Strategic Action Recommendations', margin, currentY);
  currentY += 6;

  const recs = (dashboardData.recommendations || []).slice(0, 3);
  recs.forEach((rec) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(`Priority ${rec.priority}: ${rec.title}`, margin + 2, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkTextColor);
    doc.text(`• Reason: ${rec.reason}`, margin + 4, currentY); currentY += 4;
    doc.text(`• Action: ${rec.action}`, margin + 4, currentY); currentY += 4;
    doc.text(`• Projected Impact: ${rec.estimated_impact} (${rec.timeline})`, margin + 4, currentY); currentY += 6;
  });

  // Section 5: 3-Month Outcome Predictions
  if (currentY < pageHeight - 35 && dashboardData.predictions) {
    const p = dashboardData.predictions;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...darkTextColor);
    doc.text('5. 3-Month Trajectory Predictions', margin, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedTextColor);
    const p3 = p.projections_3_months || {};
    const ifMatch = p.if_you_match_platform_avg || {};
    doc.text(`• Current Pace: ${p3.total_applications || 39} apps → ${p3.total_interviews || 21} interviews → ${p3.expected_offers || 5} offers`, margin + 3, currentY);
    currentY += 4.5;
    doc.text(`• If Matching Platform Avg: ${ifMatch.total_applications || 52} apps → ${ifMatch.total_interviews || 31} interviews → ${ifMatch.expected_offers || 12} offers (+7 lift)`, margin + 3, currentY);
  }

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('Generated by Career Copilot — AI Career Acceleration Platform', margin, pageHeight - 8);

  const fileDate = new Date().toISOString().split('T')[0];
  doc.save(`Career_Analytics_Report_${fileDate}.pdf`);
};
