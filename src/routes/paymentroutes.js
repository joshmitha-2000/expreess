const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentcontroller');
const authenticateToken = require('../middlewavers/usermiddleware'); // your auth middleware

router.post('/create', authenticateToken, paymentController.createPayment);
router.post('/confirm', authenticateToken, paymentController.confirmPayment);

module.exports = router;
