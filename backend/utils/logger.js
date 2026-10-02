// backend/utils/logger.js
const logInfo = (message, meta = '') => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ℹ️ INFO: ${message}`, meta ? JSON.stringify(meta) : '');
};

const logError = (message, error = null) => {
  const ts = new Date().toISOString();
  console.error(`[${ts}] ❌ ERROR: ${message}`, error ? (error.stack || error.message || error) : '');
};

const logWarn = (message, meta = '') => {
  const ts = new Date().toISOString();
  console.warn(`[${ts}] ⚠️ WARN: ${message}`, meta ? JSON.stringify(meta) : '');
};

module.exports = {
  logInfo,
  logError,
  logWarn
};
