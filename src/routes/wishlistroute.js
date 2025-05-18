const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistcontroller');
const authenticateToken = require('../middlewavers/usermiddleware');

router.get('/', authenticateToken, wishlistController.getWishlist);
router.post('/', authenticateToken, wishlistController.addToWishlist);
router.delete('/:productId', authenticateToken, wishlistController.removeFromWishlist);

module.exports = router;
