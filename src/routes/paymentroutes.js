const express = require('express');
const {
  createPayment,
  handleStripeWebhook,
} = require('../controllers/paymentcontroller');

const router = express.Router();

router.post('/create-payment', createPayment);

// Important: express.raw() is required for webhooks
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

module.exports = router;
