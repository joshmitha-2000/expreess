const paymentService = require('../services/paymentsrvice');

const createPayment = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);// user from authenticated middleware
    const { productId, quantity } = req.body;

    const paymentData = await paymentService.createPayment(userId, productId, quantity);

    res.json(paymentData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;

    if (!['succeeded', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const payment = await paymentService.updatePaymentStatus(paymentIntentId, status);

    res.json({ message: 'Payment status updated', payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPayment,
  confirmPayment,
};
