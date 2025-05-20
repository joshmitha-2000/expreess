// routes/wishlist.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistcontroller');
const authenticateToken = require('../middlewavers/usermiddleware');

// Get wishlist for a specific user
router.get('/:userId', authenticateToken, wishlistController.getWishlist);

// Add a product to a user's wishlist
router.post('/:userId/:productId', authenticateToken, wishlistController.addToWishlist);

// Remove a product from a user's wishlist
router.delete('/:userId/:productId', authenticateToken, wishlistController.removeFromWishlist);

module.exports = router;
