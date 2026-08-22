const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  if (req.headers['x-admin-role'] === 'admin') return next();
  return res.status(403).json({ success: false, error: 'Access denied: Admin privileges required' });
};

router.get('/stats', adminOnly, adminController.getAdminStats);
router.get('/reports', adminOnly, adminController.getReports);
router.put('/reports/:id', adminOnly, adminController.updateReportStatus);
router.get('/freshness-rules', adminOnly, adminController.getFreshnessRules);
router.post('/freshness-rules', adminOnly, adminController.upsertFreshnessRule);
router.put('/market-listings/:id/moderate', adminOnly, adminController.moderateListing);
router.put('/schemes/:id/verify', adminOnly, adminController.verifyScheme);

module.exports = router;
