const request = require('supertest');
const express = require('express');
const marketRoutes = require('../src/routes/marketRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/market', marketRoutes);

describe('Market Listing & Review API Tests', () => {

  test('SELLER DETAILS VALIDATION: Should reject listing creation when seller name or phone is missing', async () => {
    const res = await request(app)
      .post('/api/v1/market/listings')
      .send({
        title: 'Fresh Paddy',
        cropType: 'rice',
        quantity: 50,
        pricePerUnit: 40,
        termsAgreed: true,
        images: ['/assets/images/weather_farm_sky.png'],
        farmerName: '', // Missing
        farmerContact: '', // Missing
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Seller Name is required/i);
  });

  test('PHOTO VALIDATION: Should reject listing creation when product photo is missing', async () => {
    const res = await request(app)
      .post('/api/v1/market/listings')
      .send({
        farmerName: 'Ramesh Kumar',
        farmerContact: '+91 98321 00000',
        title: 'Fresh Paddy',
        cropType: 'rice',
        quantity: 50,
        pricePerUnit: 40,
        termsAgreed: true,
        images: [], // Missing photo
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Product photograph is mandatory/i);
  });

  test('TERMS VALIDATION: Should reject listing creation when seller terms are not agreed', async () => {
    const res = await request(app)
      .post('/api/v1/market/listings')
      .send({
        farmerName: 'Ramesh Kumar',
        farmerContact: '+91 98321 00000',
        title: 'Fresh Paddy',
        cropType: 'rice',
        quantity: 50,
        pricePerUnit: 40,
        termsAgreed: false,
        images: ['/assets/images/weather_farm_sky.png'],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/terms & conditions/i);
  });

  test('CREATE LISTING & RATING CALCULATION: Should start with 0 rating and update dynamically when 1-star review added', async () => {
    const res = await request(app)
      .post('/api/v1/market/listings')
      .send({
        farmerName: 'Subhadip Ghosh',
        farmerContact: '+91 98321 54321',
        title: 'Fresh Paddy Rice',
        cropType: 'rice',
        quantity: 100,
        pricePerUnit: 35,
        harvestDate: new Date().toISOString(),
        termsAgreed: true,
        images: ['/assets/images/ai_satellite_drone.png'],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.farmerName).toBe('Subhadip Ghosh');
    expect(res.body.data.farmerContact).toBe('+91 98321 54321');
    expect(res.body.data.sellerRating).toBe(0); // Starts at 0 until reviews are added

    // Add a 1-star review
    const reviewRes = await request(app)
      .post(`/api/v1/market/listings/${res.body.data._id}/reviews`)
      .send({
        buyerName: 'Anita Das',
        rating: 1,
        comment: 'Poor crop quality, damp paddy grains.',
      });

    expect(reviewRes.statusCode).toBe(201);
    expect(reviewRes.body.data.sellerRating).toBe(1); // Real-time updated to 1.0!
  });
});
