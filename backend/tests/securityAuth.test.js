const request = require('supertest');
const express = require('express');
const adminRoutes = require('../src/routes/adminRoutes');
const marketRoutes = require('../src/routes/marketRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/market', marketRoutes);

describe('Security & Authorization Guard Tests', () => {

  test('ADMIN GUARD: Should reject non-admin request to GET /api/v1/admin/stats with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats');

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Access denied/i);
  });

  test('ADMIN GUARD: Should allow admin request with valid x-admin-role header to GET /api/v1/admin/stats', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('x-admin-role', 'admin');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('VALIDATION: Should reject negative product price with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/market/listings')
      .send({
        farmerName: 'Subhadip Ghosh',
        farmerContact: '+91 98321 54321',
        cropType: 'rice',
        quantity: 100,
        pricePerUnit: -50,
        termsAgreed: true,
        images: ['/assets/images/ai_satellite_drone.png'],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Price per unit cannot be negative/i);
  });
});
