const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteAccount,
  updateUserRole 
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Protected routes
router.use(protect);
router.patch('/update-role', protect, updateUserRole);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateDetails);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/change-password', protect, updatePassword);
router.post('/verifyemail', verifyEmail);
router.delete('/deleteaccount', deleteAccount);

module.exports = router;