const { isApprovedGovtDomain, evaluateSchemeEligibility } = require('../src/services/schemeIngestionService');

describe('Government Scheme Ingestion & Eligibility Tests', () => {

  test('should validate approved government portal domain URLs', () => {
    expect(isApprovedGovtDomain('https://pmkisan.gov.in/portal')).toBe(true);
    expect(isApprovedGovtDomain('https://krishi.wb.gov.in/schemes')).toBe(true);
    expect(isApprovedGovtDomain('https://agricoop.nic.in/subsidy')).toBe(true);
  });

  test('should reject unapproved non-government domain URLs', () => {
    expect(isApprovedGovtDomain('https://fake-scheme-scam.com/apply')).toBe(false);
    expect(isApprovedGovtDomain('https://free-money-farmers.net')).toBe(false);
  });

  test('should evaluate farmer profile as Likely Eligible for state & land size match', () => {
    const scheme = {
      schemeName: 'PM-Kisan Samman Nidhi',
      eligibilityRules: {
        states: ['All'],
        maxLandAcres: 5,
        farmerCategories: ['Small & Marginal', 'All'],
      },
    };

    const farmerProfile = {
      state: 'West Bengal',
      landSize: 2.5,
      category: 'Small & Marginal',
    };

    const result = evaluateSchemeEligibility(scheme, farmerProfile);
    expect(result.status).toBe('🟢 Likely Eligible');
  });

  test('should evaluate farmer profile as Not Eligible if land holding exceeds maximum limit', () => {
    const scheme = {
      schemeName: 'Small Farmer Irrigation Subsidy',
      eligibilityRules: {
        states: ['All'],
        maxLandAcres: 2.0,
      },
    };

    const farmerProfile = {
      state: 'West Bengal',
      landSize: 10.0,
    };

    const result = evaluateSchemeEligibility(scheme, farmerProfile);
    expect(result.status).toBe('🔴 Currently Not Eligible');
  });
});
