// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewcontoller');
const authenticateToken = require('../middlewavers/usermiddleware');// Your auth middleware that sets req.user

// Post a review (protected route, user must be logged in)
router.post('/', authenticateToken, reviewController.postReview);

// Get all reviews for a product (public route)
router.get('/:productId', reviewController.getReviews);

module.exports = router;
