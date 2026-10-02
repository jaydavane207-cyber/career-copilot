// backend/utils/emailService.js

const sendWelcomeEmail = async (email, fullName) => {
  console.log(`✉️ [EmailService] Welcome email triggered for ${fullName} <${email}>`);
  return { success: true, messageId: `mock-${Date.now()}` };
};

const sendInterviewReminderEmail = async (email, companyName, interviewDate) => {
  console.log(`✉️ [EmailService] Reminder: Interview with ${companyName} scheduled for ${interviewDate} sent to ${email}`);
  return { success: true, messageId: `mock-${Date.now()}` };
};

module.exports = {
  sendWelcomeEmail,
  sendInterviewReminderEmail
};
