const mongoose = require('mongoose');
const MarketListing = require('../models/MarketListing');
const MarketConsent = require('../models/MarketConsent');
const MarketFeedback = require('../models/MarketFeedback');
const MarketReport = require('../models/MarketReport');
const { calculateFreshnessStatus } = require('../services/freshnessEngine');
const { loadStoredListings, saveStoredListings, loadStoredReports, saveStoredReports } = require('../services/marketStore');

// Helper to filter listings array in memory
function filterListingsMemory(items, { category, cropType, district, freshnessStatus, search, sort }) {
  let result = items.filter(item => item.status !== 'removed');

  if (category) {
    result = result.filter(item => item.category === category);
  }
  if (cropType && cropType !== 'all') {
    result = result.filter(item => (item.cropType || '').toLowerCase().includes(cropType.toLowerCase()));
  }
  if (district && district !== 'all') {
    const distStr = item => (item.location?.district || item.district || '').toLowerCase();
    result = result.filter(item => distStr(item).includes(district.toLowerCase()));
  }
  if (freshnessStatus && freshnessStatus !== 'all') {
    result = result.filter(item => item.freshnessStatus === freshnessStatus);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const cropMatch = (item.cropType || '').toLowerCase().includes(q);
      const varietyMatch = (item.variety || '').toLowerCase().includes(q);
      const distMatch = (item.location?.district || '').toLowerCase().includes(q);
      const farmerMatch = (item.farmerName || '').toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      return titleMatch || cropMatch || varietyMatch || distMatch || farmerMatch || descMatch;
    });
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => Number(a.pricePerUnit) - Number(b.pricePerUnit));
  } else if (sort === 'price_desc') {
    result.sort((a, b) => Number(b.pricePerUnit) - Number(a.pricePerUnit));
  } else if (sort === 'quantity') {
    result.sort((a, b) => Number(b.remainingQuantity ?? b.quantity) - Number(a.remainingQuantity ?? a.quantity));
  } else {
    result.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
  }

  return result;
}

// ── GET Seller Consent Status ────────────────────────────────────────────────
exports.getSellerConsent = async (req, res) => {
  try {
    const userId = req.user?._id || '650000000000000000000001';
    let consent = null;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      consent = await MarketConsent.findOne({ farmer: userId });
    }

    if (!consent) {
      consent = { farmer: userId, consentStatus: true, policyVersion: 'v1.0', consentedAt: new Date() };
    }

    res.json({ success: true, data: consent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── POST Seller Consent ──────────────────────────────────────────────────────
exports.postSellerConsent = async (req, res) => {
  try {
    const userId = req.user?._id || '650000000000000000000001';
    const { consentStatus = true, policyVersion = 'v1.0' } = req.body;

    let consentDoc = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      consentDoc = await MarketConsent.findOneAndUpdate(
        { farmer: userId },
        { consentStatus, policyVersion, consentedAt: new Date() },
        { upsert: true, new: true }
      );
    } else {
      consentDoc = { farmer: userId, consentStatus, policyVersion, consentedAt: new Date() };
    }

    res.json({ success: true, message: 'Marketplace Privacy Consent recorded successfully', data: consentDoc });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── GET All Buyer Active Listings ────────────────────────────────────────────
exports.getListings = async (req, res) => {
  try {
    const { category, cropType, district, freshnessStatus, search, sort } = req.query;

    let dbListings = [];

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const query = { status: 'active', remainingQuantity: { $gt: 0 } };
        if (category) query.category = category;
        if (cropType && cropType !== 'all') query.cropType = new RegExp(cropType, 'i');
        if (district && district !== 'all') query['location.district'] = new RegExp(district, 'i');
        if (freshnessStatus && freshnessStatus !== 'all') query.freshnessStatus = freshnessStatus;

        if (search && search.trim()) {
          const qReg = new RegExp(search.trim(), 'i');
          query.$or = [
            { title: qReg },
            { cropType: qReg },
            { variety: qReg },
            { 'location.district': qReg },
            { farmerName: qReg },
            { description: qReg },
          ];
        }

        let sortObj = { createdAt: -1 };
        if (sort === 'price_asc') sortObj = { pricePerUnit: 1 };
        if (sort === 'price_desc') sortObj = { pricePerUnit: -1 };
        if (sort === 'quantity') sortObj = { remainingQuantity: -1 };

        dbListings = await MarketListing.find(query).sort(sortObj);
      } catch (err) {
        console.error('Error fetching MongoDB listings:', err);
      }
    }

    const fileListings = loadStoredListings();
    const listingMap = new Map();

    dbListings.forEach(item => {
      const obj = item.toObject ? item.toObject() : item;
      listingMap.set(String(obj._id), obj);
    });

    fileListings.forEach(item => {
      if (item.status === 'active' && (item.remainingQuantity === undefined || item.remainingQuantity > 0)) {
        if (!listingMap.has(String(item._id))) {
          listingMap.set(String(item._id), item);
        }
      }
    });

    let combinedListings = Array.from(listingMap.values());
    combinedListings = filterListingsMemory(combinedListings, { category, cropType, district, freshnessStatus, search, sort });

    const updatedListings = await Promise.all(combinedListings.map(async (item) => {
      const freshStatus = await calculateFreshnessStatus(item);
      item.freshnessStatus = freshStatus;
      if (item.remainingQuantity === undefined) item.remainingQuantity = item.quantity;
      if (item.soldQuantity === undefined) item.soldQuantity = 0;
      if (!item.reviews) item.reviews = [];

      if (item.reviews.length > 0) {
        const sum = item.reviews.reduce((acc, r) => acc + Number(r.rating), 0);
        item.sellerRating = Number((sum / item.reviews.length).toFixed(1));
      } else {
        item.sellerRating = 0;
      }

      if (!item.allowBuyerContact) {
        item.farmerContact = 'Contact Hidden by Farmer Privacy Preferences';
      }

      return item;
    }));

    res.json({
      success: true,
      count: updatedListings.length,
      disclaimer: 'AgriSathi only connects farmers and buyers. Payments, delivery and transactions are handled directly between them.',
      data: updatedListings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── GET My Listings (Seller Dashboard) ───────────────────────────────────────
exports.getMyListings = async (req, res) => {
  try {
    const userId = req.user?._id || '650000000000000000000001';
    let myListings = [];

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      myListings = await MarketListing.find({ farmer: userId, status: { $ne: 'removed' } }).sort({ createdAt: -1 });
    }

    const fileListings = loadStoredListings();
    const storedMy = fileListings.filter(item => String(item.farmer) === String(userId) && item.status !== 'removed');

    const map = new Map();
    myListings.forEach(l => map.set(String(l._id), l.toObject ? l.toObject() : l));
    storedMy.forEach(l => { if (!map.has(String(l._id))) map.set(String(l._id), l); });

    const results = Array.from(map.values()).map(item => {
      if (item.remainingQuantity === undefined) item.remainingQuantity = item.quantity;
      if (item.soldQuantity === undefined) item.soldQuantity = 0;
      if (!item.reports) item.reports = [];
      // Anonymize buyer reports for seller view (hide buyer name & contact, present only reason & details)
      item.reports = item.reports.map(r => ({
        _id: r._id || new mongoose.Types.ObjectId().toString(),
        reason: r.reason || 'Flagged Listing',
        details: r.details || '',
        createdAt: r.createdAt || new Date()
      }));
      return item;
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── GET Single Listing Details ────────────────────────────────────────────────
exports.getListingById = async (req, res) => {
  try {
    let listing = null;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      listing = await MarketListing.findById(req.params.id);
    }

    if (!listing) {
      const stored = loadStoredListings();
      listing = stored.find(item => String(item._id) === String(req.params.id));
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Market listing not found' });
    }

    const freshStatus = await calculateFreshnessStatus(listing);
    listing.freshnessStatus = freshStatus;

    const result = listing.toObject ? listing.toObject() : listing;
    if (result.remainingQuantity === undefined) result.remainingQuantity = result.quantity;
    if (!result.reviews) result.reviews = [];

    res.json({
      success: true,
      disclaimer: 'AgriSathi only connects farmers and buyers. Payments, delivery and transactions are handled directly between them.',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── CREATE Market Listing ────────────────────────────────────────────────────
exports.createListing = async (req, res) => {
  try {
    const {
      farmerName, farmerContact, title, category, cropType, variety, quantity, unit, pricePerUnit,
      harvestDate, location, description, images, imageUrl, storageDetails, allowBuyerContact, termsAgreed, contactPreferences
    } = req.body;

    if (!termsAgreed) {
      return res.status(400).json({ success: false, error: 'You must agree to the Seller Product Listing Terms & Conditions to publish a listing.' });
    }

    if (!farmerName || !farmerName.trim()) {
      return res.status(400).json({ success: false, error: 'Seller Name is required.' });
    }
    if (!farmerContact || !farmerContact.trim()) {
      return res.status(400).json({ success: false, error: 'Seller Phone/Contact Number is required.' });
    }

    const imageList = (images && Array.isArray(images) && images.length > 0 && images[0])
      ? images
      : (imageUrl && imageUrl.trim() ? [imageUrl.trim()] : []);

    if (imageList.length === 0) {
      return res.status(400).json({ success: false, error: 'Product photograph is mandatory. Please upload or provide a photo of the product.' });
    }

    const numQty = Number(quantity);
    if (!numQty || numQty <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
    }

    const priceNum = Number(pricePerUnit);
    if (pricePerUnit === undefined || isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ success: false, error: 'Price per unit cannot be negative' });
    }

    const userId = req.user?._id || '650000000000000000000001';
    const validFarmerId = (userId && mongoose.Types.ObjectId.isValid(userId)) ? userId : new mongoose.Types.ObjectId();

    const listingId = new mongoose.Types.ObjectId().toString();
    const listingObj = {
      _id: listingId,
      farmer: validFarmerId,
      farmerName: farmerName.trim(),
      farmerContact: farmerContact.trim(),
      contactPreferences: contactPreferences || { showPhone: true, showWhatsapp: true, showAddress: true },
      allowBuyerContact: allowBuyerContact !== undefined ? allowBuyerContact : true,
      termsAgreed: true,
      title: title || `${cropType} Batch`,
      category: category || 'fresh',
      cropType: (cropType || 'rice').toLowerCase().trim(),
      variety: variety || 'Standard',
      quantity: numQty,
      soldQuantity: 0,
      remainingQuantity: numQty,
      unit: unit || 'kg',
      pricePerUnit: Number(pricePerUnit),
      priceHistory: [],
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      location: location || { state: 'West Bengal', district: 'North 24 Parganas', blockOrVillage: 'Barasat' },
      images: imageList,
      description: description || '',
      storageDetails: storageDetails || {},
      reviews: [],
      reports: [],
      sellerRating: 0,
      freshnessStatus: 'NEWLY ARRIVED',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const freshStatus = await calculateFreshnessStatus(listingObj);
    listingObj.freshnessStatus = freshStatus;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const newDoc = new MarketListing(listingObj);
        await newDoc.save();
      } catch (err) {
        console.error('Error saving listing to MongoDB:', err);
      }
    }

    const stored = loadStoredListings();
    stored.unshift(listingObj);
    saveStoredListings(stored);

    res.status(201).json({
      success: true,
      message: 'Produce listing created successfully',
      data: listingObj,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── UPDATE Sold Quantity ─────────────────────────────────────────────────────
exports.updateSoldQuantity = async (req, res) => {
  try {
    const { soldIncrement } = req.body;
    const increment = Number(soldIncrement);
    if (!increment || increment <= 0) {
      return res.status(400).json({ success: false, error: 'Sold quantity increment must be greater than 0' });
    }

    let listing = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      listing = await MarketListing.findById(req.params.id);
    }
    if (!listing) {
      const stored = loadStoredListings();
      listing = stored.find(item => String(item._id) === String(req.params.id));
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const currentSold = Number(listing.soldQuantity || 0);
    const newSold = currentSold + increment;
    const totalQty = Number(listing.quantity);
    const newRemaining = Math.max(0, totalQty - newSold);

    const updatePayload = {
      soldQuantity: newSold,
      remainingQuantity: newRemaining,
      status: newRemaining === 0 ? 'sold' : listing.status,
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await MarketListing.findByIdAndUpdate(req.params.id, updatePayload);
    }

    const stored = loadStoredListings();
    const idx = stored.findIndex(item => String(item._id) === String(req.params.id));
    if (idx !== -1) {
      stored[idx] = { ...stored[idx], ...updatePayload };
      saveStoredListings(stored);
    }

    res.json({
      success: true,
      message: newRemaining === 0 ? 'Listing marked as SOLD OUT!' : 'Sold quantity updated successfully',
      data: { ...listing.toObject ? listing.toObject() : listing, ...updatePayload },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── UPDATE Price ─────────────────────────────────────────────────────────────
exports.updatePrice = async (req, res) => {
  try {
    const { newPrice } = req.body;
    const priceNum = Number(newPrice);
    if (priceNum === undefined || priceNum < 0) {
      return res.status(400).json({ success: false, error: 'Valid price per unit is required' });
    }

    let listing = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      listing = await MarketListing.findById(req.params.id);
    }
    if (!listing) {
      const stored = loadStoredListings();
      listing = stored.find(item => String(item._id) === String(req.params.id));
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const prevPrice = listing.pricePerUnit;
    const priceEntry = { previousPrice: prevPrice, newPrice: priceNum, changedAt: new Date() };

    const updatePayload = {
      pricePerUnit: priceNum,
      $push: { priceHistory: priceEntry }
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await MarketListing.findByIdAndUpdate(req.params.id, updatePayload);
    }

    const stored = loadStoredListings();
    const idx = stored.findIndex(item => String(item._id) === String(req.params.id));
    if (idx !== -1) {
      stored[idx].pricePerUnit = priceNum;
      if (!stored[idx].priceHistory) stored[idx].priceHistory = [];
      stored[idx].priceHistory.push(priceEntry);
      saveStoredListings(stored);
    }

    res.json({ success: true, message: 'Price updated successfully', data: { pricePerUnit: priceNum } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── SUBMIT Buyer Feedback ────────────────────────────────────────────────────
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, feedbackType, comment, images, evidence } = req.body;
    const listingId = req.params.id;

    let listing = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      listing = await MarketListing.findById(listingId);
    }
    if (!listing) {
      const stored = loadStoredListings();
      listing = stored.find(item => String(item._id) === String(listingId));
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Market listing not found' });
    }

    const feedbackObj = {
      listing: listingId,
      seller: listing.farmer,
      buyer: req.user ? req.user._id : '650000000000000000000002',
      buyerName: req.user ? req.user.name : 'Buyer',
      rating: Number(rating) || 5,
      feedbackType: feedbackType || 'product',
      comment: comment || '',
      images: images || [],
      evidence: evidence || '',
      createdAt: new Date(),
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const doc = new MarketFeedback(feedbackObj);
        await doc.save();
      } catch (_) {}
    }

    res.status(201).json({ success: true, message: 'Buyer feedback submitted successfully', data: feedbackObj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── SUBMIT Fraud / Scam Report (Persisted to Disk & Anonymized for Seller) ───
exports.submitReport = async (req, res) => {
  try {
    const { reason, details, images } = req.body;
    const listingId = req.params.id;

    let listing = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      listing = await MarketListing.findById(listingId);
    }
    if (!listing) {
      const stored = loadStoredListings();
      listing = stored.find(item => String(item._id) === String(listingId));
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Market listing not found' });
    }

    const reportId = new mongoose.Types.ObjectId().toString();
    const reportObj = {
      _id: reportId,
      listing: listingId,
      reportedSeller: listing.farmer,
      reporter: req.user ? req.user._id : '650000000000000000000002',
      reason: reason || 'Suspected Fraud',
      details: details || '',
      images: images || [],
      status: 'Report Submitted',
      createdAt: new Date(),
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const doc = new MarketReport(reportObj);
        await doc.save();
      } catch (_) {}
    }

    // Save to marketReports.json
    const allReports = loadStoredReports();
    allReports.unshift(reportObj);
    saveStoredReports(allReports);

    // Save anonymized report to listing in marketStore.json
    const storedListings = loadStoredListings();
    const idx = storedListings.findIndex(item => String(item._id) === String(listingId));
    if (idx !== -1) {
      if (!storedListings[idx].reports) storedListings[idx].reports = [];
      storedListings[idx].reports.unshift({
        _id: reportId,
        reason: reason || 'Suspected Fraud',
        details: details || '',
        createdAt: new Date()
      });
      saveStoredListings(storedListings);
    }

    res.status(201).json({ success: true, message: 'Report submitted successfully. Seller has been notified of the subject.', data: reportObj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── UPDATE Listing ───────────────────────────────────────────────────────────
exports.updateListing = async (req, res) => {
  try {
    let listing = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      listing = await MarketListing.findById(req.params.id);
      if (listing) {
        Object.assign(listing, req.body);
        await listing.save();
      }
    }

    const storedListings = loadStoredListings();
    const idx = storedListings.findIndex(item => String(item._id) === String(req.params.id));
    if (idx !== -1) {
      storedListings[idx] = { ...storedListings[idx], ...req.body };
      saveStoredListings(storedListings);
      if (!listing) listing = storedListings[idx];
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.json({ success: true, message: 'Listing updated successfully', data: listing });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── ADD Buyer Review (Persists to MongoDB + Persistent JSON File Store) ───────
exports.addReview = async (req, res) => {
  try {
    const { buyerName, rating, comment, audioUrl, videoUrl } = req.body;
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, error: 'Review comment is required' });
    }

    const newReview = {
      _id: new mongoose.Types.ObjectId().toString(),
      buyerName: (buyerName && buyerName.trim()) ? buyerName.trim() : (req.user ? req.user.name : 'Verified Buyer'),
      rating: numRating,
      comment: comment.trim(),
      audioUrl: audioUrl || '',
      videoUrl: videoUrl || '',
      createdAt: new Date(),
    };

    let targetListing = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      targetListing = await MarketListing.findById(req.params.id);
      if (targetListing) {
        targetListing.reviews.push(newReview);
        const sum = targetListing.reviews.reduce((acc, r) => acc + Number(r.rating), 0);
        targetListing.sellerRating = Number((sum / targetListing.reviews.length).toFixed(1));
        await targetListing.save();
      }
    }

    const storedListings = loadStoredListings();
    const storeIdx = storedListings.findIndex(item => String(item._id) === String(req.params.id));
    if (storeIdx !== -1) {
      if (!storedListings[storeIdx].reviews) storedListings[storeIdx].reviews = [];
      storedListings[storeIdx].reviews.unshift(newReview);
      const sum = storedListings[storeIdx].reviews.reduce((acc, r) => acc + Number(r.rating), 0);
      storedListings[storeIdx].sellerRating = Number((sum / storedListings[storeIdx].reviews.length).toFixed(1));
      saveStoredListings(storedListings);
      if (!targetListing) targetListing = storedListings[storeIdx];
    }

    if (!targetListing) {
      return res.status(404).json({ success: false, error: 'Market listing not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Review and rating submitted successfully',
      data: targetListing.toObject ? targetListing.toObject() : targetListing,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── DELETE Listing (Soft Delete) ─────────────────────────────────────────────
exports.deleteListing = async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await MarketListing.findByIdAndUpdate(req.params.id, { status: 'removed', deletedAt: new Date() });
    }

    const storedListings = loadStoredListings();
    const idx = storedListings.findIndex(item => String(item._id) === String(req.params.id));
    if (idx !== -1) {
      storedListings[idx].status = 'removed';
      storedListings[idx].deletedAt = new Date();
      saveStoredListings(storedListings);
    }

    res.json({ success: true, message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
