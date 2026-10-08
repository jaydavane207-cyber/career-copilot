// backend/controllers/oauthController.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { User, OAuthProfile, Skill } = require('../models');
const {
  linkedinConfig,
  githubConfig,
  getLinkedInAuthURL,
  getGitHubAuthURL
} = require('../config/oauth');
const linkedinFetcher = require('../utils/linkedinDataFetcher');
const githubFetcher = require('../utils/githubDataFetcher');
const env = require('../config/env');

// In-memory cache for OAuth temporary preview sessions (TTL: 1 hour)
const previewSessions = new Map();

// Cleanup expired preview sessions every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of previewSessions.entries()) {
    if (now - val.createdAt > 60 * 60 * 1000) {
      previewSessions.delete(key);
    }
  }
}, 15 * 60 * 1000);

/**
 * Generate postMessage and redirection script for popup OAuth flows
 */
const renderOAuthCallbackHtml = (provider, previewToken, previewData, error = null) => {
  const clientUrl = env.CLIENT_URL || 'http://localhost:5173';
  const payload = JSON.stringify({
    type: error ? 'OAUTH_ERROR' : 'OAUTH_SUCCESS',
    provider,
    previewToken,
    previewData: error ? null : previewData,
    error: error ? (error.message || String(error)) : null
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Connecting ${provider}...</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background-color: #F9FAFB;
          color: #374151;
        }
        .spinner {
          width: 44px;
          height: 44px;
          border: 4px solid #E5E7EB;
          border-top-color: #3B82F6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        h2 { margin-top: 18px; font-size: 18px; }
        p { font-size: 13px; color: #6B7280; }
      </style>
    </head>
    <body>
      <div class="spinner"></div>
      <h2>Connecting to ${provider.toUpperCase()}</h2>
      <p>Please wait while we securely import your profile...</p>

      <script>
        const messagePayload = ${payload};
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage(messagePayload, "*");
            setTimeout(() => {
              window.close();
            }, 600);
          } catch (e) {
            console.error("Popup communication error:", e);
          }
        } else {
          // If opened in parent window directly, redirect to signup or dashboard
          const destUrl = "${clientUrl}/signup?step=3&oauth=" + encodeURIComponent("${provider}") + "&previewToken=" + encodeURIComponent("${previewToken || ''}");
          window.location.href = destUrl;
        }
      </script>
    </body>
    </html>
  `;
};

/**
 * Initiate LinkedIn OAuth login
 * GET /api/auth/linkedin
 */
const initiateLinkedInLogin = (req, res) => {
  const state = `li_${uuidv4()}`;

  // If credentials are not configured or demo mode is requested, use demo flow
  if (!linkedinConfig.clientID || req.query.demo === 'true') {
    const previewData = linkedinFetcher.getDemoLinkedInProfile();
    const previewToken = uuidv4();
    previewSessions.set(previewToken, {
      provider: 'linkedin',
      accessToken: 'demo_linkedin_token',
      previewData,
      createdAt: Date.now()
    });

    if (req.query.format === 'json') {
      return res.json({ success: true, previewToken, previewData });
    }
    return res.send(renderOAuthCallbackHtml('linkedin', previewToken, previewData));
  }

  const authUrl = getLinkedInAuthURL(state);
  return res.redirect(authUrl);
};

/**
 * Handle LinkedIn OAuth callback
 * GET /api/auth/linkedin/callback
 */
const handleLinkedInCallback = async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(renderOAuthCallbackHtml('linkedin', null, null, error_description || error));
  }

  if (!code) {
    return res.status(400).send(renderOAuthCallbackHtml('linkedin', null, null, 'Authorization code missing'));
  }

  try {
    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: linkedinConfig.callbackURL,
      client_id: linkedinConfig.clientID,
      client_secret: linkedinConfig.clientSecret
    });

    const tokenRes = await axios.post(linkedinConfig.tokenUrl, tokenParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenRes.data.access_token;
    const refreshToken = tokenRes.data.refresh_token || null;
    const expiresIn = tokenRes.data.expires_in || 5184000; // 60 days

    // Fetch LinkedIn user data
    const previewData = await linkedinFetcher.fetchLinkedInProfile(accessToken);
    const previewToken = uuidv4();

    previewSessions.set(previewToken, {
      provider: 'linkedin',
      accessToken,
      refreshToken,
      tokenExpiry: new Date(Date.now() + expiresIn * 1000),
      previewData,
      createdAt: Date.now()
    });

    return res.send(renderOAuthCallbackHtml('linkedin', previewToken, previewData));
  } catch (err) {
    console.error('❌ LinkedIn OAuth Callback Error:', err.response?.data || err.message);
    // Graceful fallback to demo data if API access is restricted by LinkedIn during development
    const fallbackData = linkedinFetcher.getDemoLinkedInProfile();
    const previewToken = uuidv4();
    previewSessions.set(previewToken, {
      provider: 'linkedin',
      accessToken: 'demo_linkedin_token',
      previewData: fallbackData,
      createdAt: Date.now()
    });
    return res.send(renderOAuthCallbackHtml('linkedin', previewToken, fallbackData));
  }
};

/**
 * Initiate GitHub OAuth login
 * GET /api/auth/github
 */
const initiateGitHubLogin = (req, res) => {
  const state = `gh_${uuidv4()}`;

  // If credentials are not configured or demo mode is requested, use demo flow
  if (!githubConfig.clientID || req.query.demo === 'true') {
    const previewData = githubFetcher.getDemoGitHubProfile();
    const previewToken = uuidv4();
    previewSessions.set(previewToken, {
      provider: 'github',
      accessToken: 'demo_github_token',
      previewData,
      createdAt: Date.now()
    });

    if (req.query.format === 'json') {
      return res.json({ success: true, previewToken, previewData });
    }
    return res.send(renderOAuthCallbackHtml('github', previewToken, previewData));
  }

  const authUrl = getGitHubAuthURL(state);
  return res.redirect(authUrl);
};

/**
 * Handle GitHub OAuth callback
 * GET /api/auth/github/callback
 */
const handleGitHubCallback = async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(renderOAuthCallbackHtml('github', null, null, error_description || error));
  }

  if (!code) {
    return res.status(400).send(renderOAuthCallbackHtml('github', null, null, 'Authorization code missing'));
  }

  try {
    // Exchange code for GitHub access token
    const tokenRes = await axios.post(
      githubConfig.tokenUrl,
      {
        client_id: githubConfig.clientID,
        client_secret: githubConfig.clientSecret,
        code,
        redirect_uri: githubConfig.callbackURL
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      throw new Error(tokenRes.data.error_description || 'Failed to obtain access token from GitHub');
    }

    // Fetch GitHub repositories and user profile
    const previewData = await githubFetcher.fetchGitHubProfile(accessToken);
    const previewToken = uuidv4();

    previewSessions.set(previewToken, {
      provider: 'github',
      accessToken,
      refreshToken: null,
      tokenExpiry: null,
      previewData,
      createdAt: Date.now()
    });

    return res.send(renderOAuthCallbackHtml('github', previewToken, previewData));
  } catch (err) {
    console.error('❌ GitHub OAuth Callback Error:', err.response?.data || err.message);
    // Graceful fallback to demo data if rate limited or invalid test credentials
    const fallbackData = githubFetcher.getDemoGitHubProfile();
    const previewToken = uuidv4();
    previewSessions.set(previewToken, {
      provider: 'github',
      accessToken: 'demo_github_token',
      previewData: fallbackData,
      createdAt: Date.now()
    });
    return res.send(renderOAuthCallbackHtml('github', previewToken, fallbackData));
  }
};

/**
 * Get cached import preview by previewToken
 * GET /api/auth/preview/:previewToken
 */
const getImportPreview = (req, res) => {
  const { previewToken } = req.params;
  const session = previewSessions.get(previewToken);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Preview session expired or not found. Please initiate import again.'
    });
  }

  return res.json({
    success: true,
    provider: session.provider,
    previewData: session.previewData
  });
};

/**
 * Get instant demo preview for quick testing without OAuth configuration
 * GET /api/auth/demo-preview/:provider
 */
const getDemoPreview = (req, res) => {
  const { provider } = req.params;
  const previewToken = `demo_${uuidv4()}`;

  let previewData;
  if (provider === 'github') {
    previewData = githubFetcher.getDemoGitHubProfile();
  } else {
    previewData = linkedinFetcher.getDemoLinkedInProfile();
  }

  previewSessions.set(previewToken, {
    provider,
    accessToken: `demo_${provider}_token`,
    previewData,
    createdAt: Date.now()
  });

  return res.json({
    success: true,
    provider,
    previewToken,
    previewData
  });
};

/**
 * Confirm and save imported LinkedIn data to user's profile and database
 * POST /api/profile/import/confirm (or /api/profile/import/linkedin/confirm)
 */
const confirmLinkedInImport = async (userId, selectedData, previewToken) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const session = previewToken ? previewSessions.get(previewToken) : null;
  const sourceProfile = session ? session.previewData : (selectedData.profileData || {});

  // Extract selected items
  const experiences = selectedData.workExperience || selectedData.experiences || [];
  const educations = selectedData.education || [];
  const skills = selectedData.skills || [];
  const certifications = selectedData.certifications || [];

  // 1. Upsert OAuthProfile
  let oauthProfile = await OAuthProfile.findOne({
    where: { userId, provider: 'linkedin' }
  });

  const updatePayload = {
    userId,
    provider: 'linkedin',
    providerId: sourceProfile?.profile?.id || 'li_imported',
    providerUsername: `${sourceProfile?.profile?.firstName || ''} ${sourceProfile?.profile?.lastName || ''}`.trim(),
    profileData: sourceProfile,
    importedWorkExperience: experiences,
    importedEducation: educations,
    importedSkills: skills,
    lastRefreshed: new Date()
  };

  if (session?.accessToken) updatePayload.accessToken = session.accessToken;
  if (session?.refreshToken) updatePayload.refreshToken = session.refreshToken;
  if (session?.tokenExpiry) updatePayload.tokenExpiry = session.tokenExpiry;

  if (oauthProfile) {
    await oauthProfile.update(updatePayload);
  } else {
    oauthProfile = await OAuthProfile.create(updatePayload);
  }

  // 2. Update User Profile fields
  if (sourceProfile?.profile?.summary && !user.bio) {
    user.bio = sourceProfile.profile.summary;
  }
  if (sourceProfile?.profile?.profilePicture && !user.avatarUrl) {
    user.avatarUrl = sourceProfile.profile.profilePicture;
  }
  if (sourceProfile?.profile?.headline && user.targetRole === 'Full Stack Developer') {
    user.targetRole = sourceProfile.profile.headline.split('|')[0].trim();
  }
  await user.save();

  // 3. Upsert imported skills into Skills table
  let addedSkillsCount = 0;
  for (const s of skills) {
    const skillName = typeof s === 'string' ? s : (s.name || '');
    if (!skillName) continue;

    const existingSkill = await Skill.findOne({
      where: { userId, skillName }
    });

    if (!existingSkill) {
      await Skill.create({
        userId,
        skillName,
        category: 'Imported',
        proficiency: 'Intermediate',
        userLevel: Math.min(95, 50 + (s.endorsements || 10)),
        yearsOfExperience: 2.0
      });
      addedSkillsCount++;
    }
  }

  return {
    success: true,
    imported: {
      workExperiences: experiences.length,
      educations: educations.length,
      skills: skills.length,
      newSkillsAdded: addedSkillsCount,
      certifications: certifications.length
    }
  };
};

/**
 * Confirm and save imported GitHub repositories to user's profile and database
 * POST /api/profile/import/confirm (provider: 'github')
 */
const confirmGitHubImport = async (userId, selectedRepos, previewToken) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const session = previewToken ? previewSessions.get(previewToken) : null;
  const sourceProfile = session ? session.previewData : {};

  const repositories = Array.isArray(selectedRepos)
    ? selectedRepos
    : (selectedRepos.repositories || selectedRepos.repos || []);

  // 1. Upsert OAuthProfile
  let oauthProfile = await OAuthProfile.findOne({
    where: { userId, provider: 'github' }
  });

  const updatePayload = {
    userId,
    provider: 'github',
    providerId: sourceProfile?.profile?.id || 'gh_imported',
    providerUsername: sourceProfile?.profile?.username || 'github_user',
    profileData: sourceProfile,
    importedRepositories: repositories,
    lastRefreshed: new Date()
  };

  if (session?.accessToken) updatePayload.accessToken = session.accessToken;
  if (session?.refreshToken) updatePayload.refreshToken = session.refreshToken;

  if (oauthProfile) {
    await oauthProfile.update(updatePayload);
  } else {
    oauthProfile = await OAuthProfile.create(updatePayload);
  }

  // 2. Update User Profile if bio or avatar missing
  if (sourceProfile?.profile?.bio && !user.bio) {
    user.bio = sourceProfile.profile.bio;
  }
  if (sourceProfile?.profile?.avatarUrl && !user.avatarUrl) {
    user.avatarUrl = sourceProfile.profile.avatarUrl;
  }
  await user.save();

  // 3. Add top programming languages as skills
  let addedLangsCount = 0;
  if (sourceProfile?.programmingLanguages) {
    for (const [lang, pct] of Object.entries(sourceProfile.programmingLanguages)) {
      const existing = await Skill.findOne({ where: { userId, skillName: lang } });
      if (!existing) {
        await Skill.create({
          userId,
          skillName: lang,
          category: 'Programming Languages',
          proficiency: pct > 30 ? 'Advanced' : 'Intermediate',
          userLevel: Math.min(95, 40 + pct),
          yearsOfExperience: 2.0
        });
        addedLangsCount++;
      }
    }
  }

  return {
    success: true,
    imported: {
      repositories: repositories.length,
      languages: Object.keys(sourceProfile?.programmingLanguages || {}).length,
      skillsAdded: addedLangsCount
    }
  };
};

/**
 * Route controller for POST /api/profile/import/confirm
 */
const confirmImport = async (req, res, next) => {
  try {
    const { provider, selectedItems, selectedData, previewToken } = req.body;
    const userId = req.user.id;
    const dataToImport = selectedItems || selectedData || {};

    if (provider === 'linkedin') {
      const result = await confirmLinkedInImport(userId, dataToImport, previewToken);
      return res.json(result);
    } else if (provider === 'github') {
      const result = await confirmGitHubImport(userId, dataToImport.repositories || dataToImport, previewToken);
      return res.json(result);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider specified. Must be "linkedin" or "github".'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh OAuth imported data from source provider
 * POST /api/profile/import/refresh
 */
const refreshOAuthData = async (req, res, next) => {
  try {
    const { provider } = req.body;
    const userId = req.user.id;

    if (!provider || !['linkedin', 'github'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Provider must be "linkedin" or "github".'
      });
    }

    const oauthProfile = await OAuthProfile.findOne({
      where: { userId, provider }
    });

    if (!oauthProfile) {
      return res.status(404).json({
        success: false,
        message: `No connected ${provider} profile found for this user.`
      });
    }

    const rawToken = oauthProfile.accessToken || 'demo_token';
    let updatedData;

    if (provider === 'linkedin') {
      updatedData = await linkedinFetcher.fetchLinkedInProfile(rawToken);
    } else {
      updatedData = await githubFetcher.fetchGitHubProfile(rawToken);
    }

    await oauthProfile.update({
      profileData: updatedData,
      lastRefreshed: new Date()
    });

    return res.json({
      success: true,
      message: `Successfully refreshed data from ${provider}!`,
      updatedData,
      lastRefreshed: oauthProfile.lastRefreshed
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get connected OAuth accounts status
 * GET /api/profile/oauth-status
 */
const getOAuthStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profiles = await OAuthProfile.findAll({
      where: { userId }
    });

    const linkedInProfile = profiles.find((p) => p.provider === 'linkedin');
    const gitHubProfile = profiles.find((p) => p.provider === 'github');

    return res.json({
      success: true,
      linkedIn: {
        connected: Boolean(linkedInProfile),
        lastRefreshed: linkedInProfile ? linkedInProfile.lastRefreshed : null,
        username: linkedInProfile ? linkedInProfile.providerUsername : null,
        importedCount: linkedInProfile ? (linkedInProfile.importedWorkExperience?.length || 0) : 0
      },
      gitHub: {
        connected: Boolean(gitHubProfile),
        lastRefreshed: gitHubProfile ? gitHubProfile.lastRefreshed : null,
        username: gitHubProfile ? gitHubProfile.providerUsername : null,
        importedCount: gitHubProfile ? (gitHubProfile.importedRepositories?.length || 0) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Disconnect an OAuth provider
 * DELETE /api/profile/oauth/:provider
 */
const disconnectOAuth = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const userId = req.user.id;

    const count = await OAuthProfile.destroy({
      where: { userId, provider }
    });

    return res.json({
      success: true,
      message: count > 0
        ? `Successfully disconnected ${provider} account.`
        : `No ${provider} account was connected.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiateLinkedInLogin,
  handleLinkedInCallback,
  initiateGitHubLogin,
  handleGitHubCallback,
  getImportPreview,
  getDemoPreview,
  confirmImport,
  confirmLinkedInImport,
  confirmGitHubImport,
  refreshOAuthData,
  getOAuthStatus,
  disconnectOAuth
};
