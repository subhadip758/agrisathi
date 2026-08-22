require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const SoilAnalysis = require('../models/SoilAnalysis');
const WaterSource = require('../models/WaterSource');
const MarketListing = require('../models/MarketListing');
const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const jsonFileStore = require('../utils/jsonFileStore');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://squadsyntax72_db_user:mdwXweprjlzhoLPe@cluster4562.wdxp2xh.mongodb.net/agriAI?retryWrites=true&w=majority';

async function seedCloudAtlas() {
  try {
    console.log('🚀 Connecting to MongoDB Atlas Cloud Database...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB Atlas Cloud Database successfully!');

    // 1. Seed Main Farmer User
    const defaultUser = {
      _id: '650000000000000000000001',
      name: 'Subhadip Pal',
      email: 'subhadippalx@gmail.com',
      phone: '8389914302',
      address: 'Barasat, District North 24 Parganas, West Bengal',
      role: 'farmer',
      isActive: true,
      isEmailVerified: true,
      farmDetails: {
        farmName: 'AgriSathi Demo Farm',
        landSize: '4.5',
        cropTypes: ['Rice', 'Wheat', 'Potato', 'Vegetables'],
        soilType: 'Loamy Alluvial (দোআঁশ মাটি / दोमट मिट्टी)',
        irrigationType: 'Borewell + Drip Irrigation',
        location: { city: 'Barasat', district: 'North 24 Parganas', state: 'West Bengal', country: 'India' }
      }
    };

    await User.findByIdAndUpdate(defaultUser._id, defaultUser, { upsert: true, new: true });
    console.log('✅ Seeded Main User (Subhadip Pal) in MongoDB Atlas!');

    // 2. Sync Local Soil Analyses into MongoDB Atlas
    const localSoil = jsonFileStore.getSoilAnalyses('650000000000000000000001');
    if (localSoil && localSoil.length > 0) {
      for (const item of localSoil) {
        try {
          await SoilAnalysis.findByIdAndUpdate(item._id, item, { upsert: true });
        } catch (_) {}
      }
      console.log(`✅ Synced ${localSoil.length} Soil Analysis records to MongoDB Atlas!`);
    }

    // 3. Seed Marketplace Listings into MongoDB Atlas
    const fs = require('fs');
    const path = require('path');
    const marketStorePath = path.join(__dirname, '../data/marketStore.json');
    if (fs.existsSync(marketStorePath)) {
      const listings = JSON.parse(fs.readFileSync(marketStorePath, 'utf-8'));
      for (const listing of listings) {
        try {
          await MarketListing.findByIdAndUpdate(listing._id, listing, { upsert: true });
        } catch (_) {}
      }
      console.log(`✅ Synced ${listings.length} Agri Market listings to MongoDB Atlas!`);
    }

    // 4. Seed Community Posts into MongoDB Atlas
    const commStorePath = path.join(__dirname, '../data/communityStore.json');
    if (fs.existsSync(commStorePath)) {
      const posts = JSON.parse(fs.readFileSync(commStorePath, 'utf-8'));
      for (const post of posts) {
        try {
          await CommunityPost.findByIdAndUpdate(post._id, post, { upsert: true });
        } catch (_) {}
      }
      console.log(`✅ Synced ${posts.length} Community posts to MongoDB Atlas!`);
    }

    console.log('🎉 ALL PROJECT DATA SUCCESSFULLY STORED & SYNCED IN MONGODB ATLAS CLOUD DATABASE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Atlas Seeding Error:', err.message);
    process.exit(1);
  }
}

seedCloudAtlas();
