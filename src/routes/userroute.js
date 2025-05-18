const express = require('express');
const router = express.Router();
const {
  register,
  confirmEmail,
  login,
  profile
} = require('../controllers/usercontroller');
const authenticateToken = require('../middlewavers/usermiddleware');

router.post('/register', register);  // Register route
router.get('/confirm/:confirmationCode', confirmEmail);  // Confirm email route
router.post('/login', login);  // Login route
router.get('/profile', authenticateToken, profile);  // Profile route

module.exports = router;
