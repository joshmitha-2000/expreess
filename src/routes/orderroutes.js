const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewavers/usermiddleware'); // your JWT auth middleware
const { createOrder, getUserOrders, getOrderById, deleteOrder } = require('../controllers/ordercontroller');

// Apply JWT middleware to all order routes
router.use(authenticateToken);

// Routes
router.post('/', createOrder);       // Create new order
router.get('/', getUserOrders);      // Get all orders for logged-in user
router.get('/:id', getOrderById);    // Get order by ID (only if belongs to user)
router.delete('/:id', deleteOrder);  // DELETE order by ID

module.exports = router;
