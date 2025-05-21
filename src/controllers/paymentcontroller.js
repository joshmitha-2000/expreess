const paymentService = require("../services/paymentsrvice");

exports.createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.body;

    console.log("createPaymentIntent - userId:", userId);
    console.log("createPaymentIntent - orderId:", orderId);

    if (!userId || !orderId) {
      return res.status(400).json({ message: "Missing userId or orderId" });
    }

    const result = await paymentService.createPaymentIntent({
      userId: Number(userId),
      orderId: Number(orderId),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Payment Error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const payments = await paymentService.getPaymentsByUser(Number(userId));
    return res.json(payments);
  } catch (err) {
    console.error("Get payments error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const paymentId = Number(req.params.id);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(paymentId)) return res.status(400).json({ message: "Invalid payment ID" });

    const payment = await paymentService.getPaymentById(Number(userId), paymentId);
    return res.json(payment);
  } catch (err) {
    console.error("Get payment by id error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
