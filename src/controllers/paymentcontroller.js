const PaymentService = require('../services/paymentservice');

const initiatePaymentHandler = async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const razorpayOrder = await PaymentService.createRazorpayOrder(amount);
    await PaymentService.savePaymentDetails(
      orderId,
      razorpayOrder.id,
      amount,
      razorpayOrder.receipt
    );

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

const confirmPaymentHandler = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;

  try {
    const updatedPayment = await PaymentService.updatePaymentStatus(
      razorpayOrderId,
      razorpayPaymentId
    );
    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ error: 'Payment confirmation failed', details: error.message });
  }
};

module.exports = { initiatePaymentHandler, confirmPaymentHandler };
