const { calculateFreshnessStatus, DEFAULT_FRESH_RULES, DEFAULT_COLD_RULES } = require('../src/services/freshnessEngine');

describe('Freshness Engine Tests', () => {

  test('should classify newly harvested spinach as NEWLY ARRIVED', async () => {
    const listing = {
      category: 'fresh',
      cropType: 'spinach',
      harvestDate: new Date(),
    };

    const status = await calculateFreshnessStatus(listing);
    expect(status).toBe('NEWLY ARRIVED');
  });

  test('should classify spinach harvested 5 days ago as AGING', async () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const listing = {
      category: 'fresh',
      cropType: 'spinach',
      harvestDate: fiveDaysAgo,
    };

    const status = await calculateFreshnessStatus(listing);
    expect(status).toBe('AGING');
  });

  test('should classify spinach harvested 6 days ago as OLD', async () => {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const listing = {
      category: 'fresh',
      cropType: 'spinach',
      harvestDate: sixDaysAgo,
    };

    const status = await calculateFreshnessStatus(listing);
    expect(status).toBe('OLD');
  });

  test('should classify spinach harvested 10 days ago as QUALITY REVIEW', async () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const listing = {
      category: 'fresh',
      cropType: 'spinach',
      harvestDate: tenDaysAgo,
    };

    const status = await calculateFreshnessStatus(listing);
    expect(status).toBe('QUALITY REVIEW');
  });

  test('COLD STORAGE: should classify potato stored 30 days ago in cold storage as FRESH (not OLD)', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const listing = {
      category: 'cold_storage',
      cropType: 'potato',
      harvestDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Harvested 60 days ago
      storageDetails: {
        storageDate: thirtyDaysAgo, // Stored 30 days ago
        coldStorageName: 'Barasat Cold Storage',
      },
    };

    const status = await calculateFreshnessStatus(listing);
    expect(['NEWLY ARRIVED', 'FRESH']).toContain(status);
  });
});
