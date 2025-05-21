const paymentService = require("../services/paymentsrvice");

exports.createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const result = await paymentService.createPaymentIntent({ userId, orderId });
    res.status(200).json(result);
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const payments = await paymentService.getPaymentsByUser(userId);
    res.json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const paymentId = parseInt(req.params.id, 10);
    if (isNaN(paymentId)) {
      return res.status(400).json({ message: "Invalid payment ID" });
    }
    const payment = await paymentService.getPaymentById(userId, paymentId);
    res.json(payment);
  } catch (error) {
    console.error("Get Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};
