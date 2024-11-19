const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser); // Register user
router.post('/login', loginUser);       // Login user
router.get('/profile', protect, getProfile); // Get profile (protected)

module.exports = router;
