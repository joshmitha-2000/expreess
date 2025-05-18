const prisma = require('../prisma/client');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };
  return await razorpay.orders.create(options);
};

const savePaymentDetails = async (orderId, razorpayOrderId, amount, receipt) => {
  return await prisma.payment.create({
    data: {
      orderId,
      razorpayOrderId,
      amount,
      receipt,
      status: 'created',
    },
  });
};

const updatePaymentStatus = async (razorpayOrderId, razorpayPaymentId) => {
  return await prisma.payment.update({
    where: { razorpayOrderId },
    data: {
      razorpayPaymentId,
      status: 'paid',
    },
  });
};

module.exports = {
  createRazorpayOrder,
  savePaymentDetails,
  updatePaymentStatus,
};
