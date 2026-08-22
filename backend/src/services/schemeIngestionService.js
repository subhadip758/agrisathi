const GovernmentScheme = require('../models/GovernmentScheme');

const APPROVED_GOVT_DOMAINS = [
  'gov.in',
  'nic.in',
  'pmkisan.gov.in',
  'matirkatha.net',
  'krishi.wb.gov.in',
  'agricoop.nic.in',
  'icar.org.in',
];

/**
 * Validates whether a scheme URL originates from an approved official government domain
 */
function isApprovedGovtDomain(urlStr) {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    return APPROVED_GOVT_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

/**
 * Evaluates farmer profile eligibility against scheme criteria
 */
function evaluateSchemeEligibility(scheme, farmerProfile = {}) {
  if (!scheme) {
    return {
      status: '🔴 Currently Not Eligible',
      badge: 'danger',
      reason: 'Scheme details invalid or missing.',
    };
  }

  const { eligibilityRules = {} } = scheme;

  const farmerState = (farmerProfile.state || 'West Bengal').toLowerCase();
  const farmerLand = Number(farmerProfile.landSize || 4.5);
  const farmerCategory = (farmerProfile.category || 'Small & Marginal').toLowerCase();

  // Check state match
  if (eligibilityRules.states && eligibilityRules.states.length > 0) {
    const matchedState = eligibilityRules.states.some(s => s.toLowerCase() === 'all' || s.toLowerCase().includes(farmerState));
    if (!matchedState) {
      return {
        status: '🔴 Currently Not Eligible',
        badge: 'danger',
        reason: `Scheme is only applicable for ${eligibilityRules.states.join(', ')}`,
      };
    }
  }

  // Check land size limit
  if (eligibilityRules.maxLandAcres && farmerLand > eligibilityRules.maxLandAcres) {
    return {
      status: '🔴 Currently Not Eligible',
      badge: 'danger',
      reason: `Land holding (${farmerLand} acres) exceeds maximum threshold (${eligibilityRules.maxLandAcres} acres)`,
    };
  }

  // Check farmer category
  if (eligibilityRules.farmerCategories && eligibilityRules.farmerCategories.length > 0) {
    const matchedCat = eligibilityRules.farmerCategories.some(c => c.toLowerCase() === 'all' || farmerCategory.includes(c.toLowerCase()));
    if (!matchedCat) {
      return {
        status: '🟡 More Information Required',
        badge: 'warning',
        reason: `Requires verification of farmer category (${eligibilityRules.farmerCategories.join(', ')})`,
      };
    }
  }

  return {
    status: '🟢 Likely Eligible',
    badge: 'success',
    reason: 'Your profile location, land holding size, and crop parameters match the published government scheme rules.',
  };
}

/**
 * Ingests a new scheme proposal after domain whitelisting check
 */
async function ingestScheme(schemeData) {
  const portalUrl = schemeData.officialPortalUrl || schemeData.sourceUrl;

  if (!isApprovedGovtDomain(portalUrl)) {
    throw new Error(`Domain verification failed. Source URL ${portalUrl} is not an approved government portal domain.`);
  }

  // Duplicate detection by scheme name or official URL
  const existing = await GovernmentScheme.findOne({
    $or: [
      { schemeName: new RegExp('^' + schemeData.schemeName + '$', 'i') },
      { officialPortalUrl: portalUrl },
    ],
  });

  if (existing) {
    existing.lastVerifiedAt = new Date();
    await existing.save();
    return existing;
  }

  const hostname = new URL(portalUrl).hostname;

  const newScheme = new GovernmentScheme({
    ...schemeData,
    officialSourceDomain: hostname,
    status: 'published',
    lastVerifiedAt: new Date(),
  });

  await newScheme.save();
  return newScheme;
}

module.exports = {
  isApprovedGovtDomain,
  evaluateSchemeEligibility,
  ingestScheme,
  APPROVED_GOVT_DOMAINS,
};
