const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/listings', marketController.getListings);
router.get('/my-listings', optionalAuth, marketController.getMyListings);
router.get('/consent', optionalAuth, marketController.getSellerConsent);
router.post('/consent', optionalAuth, marketController.postSellerConsent);
router.get('/listings/:id', marketController.getListingById);
router.post('/listings', optionalAuth, marketController.createListing);
router.patch('/listings/:id/sold-quantity', optionalAuth, marketController.updateSoldQuantity);
router.patch('/listings/:id/price', optionalAuth, marketController.updatePrice);
router.post('/listings/:id/reviews', optionalAuth, marketController.addReview);
router.post('/listings/:id/feedback', optionalAuth, marketController.submitFeedback);
router.post('/listings/:id/report', optionalAuth, marketController.submitReport);
router.put('/listings/:id', optionalAuth, marketController.updateListing);
router.delete('/listings/:id', optionalAuth, marketController.deleteListing);

module.exports = router;
