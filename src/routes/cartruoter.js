
// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartcontroller');
const authenticateToken = require('../middlewavers/usermiddleware');

router.post('/:userId', authenticateToken, cartController.addToCart);
router.get('/:userId', authenticateToken, cartController.getCartController);
router.delete('/:userId/:productId', authenticateToken, cartController.removeFromCartController);
router.put('/:userId/:productId', authenticateToken, cartController.updateQuantityController);

module.exports = router;
