const express = require('express');
const router = express.Router();
const {
  initiatePaymentHandler,
  confirmPaymentHandler,
} = require('../controllers/paymentcontroller');

router.post('/initiate', initiatePaymentHandler);
router.post('/confirm', confirmPaymentHandler);

module.exports = router;
