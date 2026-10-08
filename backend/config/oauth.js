// backend/config/oauth.js
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Encryption Configuration for Sensitive OAuth Tokens
// Uses AES-256-CBC with a 32-byte key derived via SHA-256
const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'career_copilot_secure_encryption_key_2026';
const KEY = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest();
const IV_LENGTH = 16; // AES block size

/**
 * Encrypts sensitive string (e.g., OAuth access / refresh token)
 * @param {string} text - Plaintext token string
 * @returns {string} Hex encoded IV:Ciphertext string
 */
const encryptToken = (text) => {
  if (!text) return null;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
    let encrypted = cipher.update(String(text), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('⚠️ [OAuth Encryption Error]:', error.message);
    return text;
  }
};

/**
 * Decrypts encrypted token string back to plaintext
 * @param {string} encryptedText - Encrypted IV:Ciphertext string
 * @returns {string} Plaintext token string
 */
const decryptToken = (encryptedText) => {
  if (!encryptedText) return null;
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) return encryptedText; // Unencrypted fallback

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('⚠️ [OAuth Decryption Error]:', error.message);
    return encryptedText;
  }
};

// LinkedIn OAuth Configuration
const linkedinConfig = {
  clientID: process.env.LINKEDIN_CLIENT_ID || '',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
  callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5000/api/auth/linkedin/callback',
  scope: [
    'openid',
    'profile',
    'email'
  ],
  authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken'
};

// GitHub OAuth Configuration
const githubConfig = {
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
  scope: [
    'user:email',
    'public_repo',
    'read:user'
  ],
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token'
};

/**
 * Build authorization URL for LinkedIn
 */
const getLinkedInAuthURL = (state = 'state_cc_linkedin') => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: linkedinConfig.clientID,
    redirect_uri: linkedinConfig.callbackURL,
    state,
    scope: linkedinConfig.scope.join(' ')
  });
  return `${linkedinConfig.authUrl}?${params.toString()}`;
};

/**
 * Build authorization URL for GitHub
 */
const getGitHubAuthURL = (state = 'state_cc_github') => {
  const params = new URLSearchParams({
    client_id: githubConfig.clientID,
    redirect_uri: githubConfig.callbackURL,
    state,
    scope: githubConfig.scope.join(' ')
  });
  return `${githubConfig.authUrl}?${params.toString()}`;
};

module.exports = {
  linkedinConfig,
  githubConfig,
  encryptToken,
  decryptToken,
  getLinkedInAuthURL,
  getGitHubAuthURL
};
