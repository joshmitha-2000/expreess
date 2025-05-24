const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const createStripePaymentIntent = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });

  if (!order) throw new Error("Order not found");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.amount * 100), // Stripe takes cents
    currency: "usd",
    metadata: {
      orderId: order.id.toString(),
      userId: order.userId.toString(),
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: paymentIntent.id, // reuse field name
      amount: order.amount,
      status: "created",
    },
  });

  return paymentIntent.client_secret;
};

const updatePaymentStatus = async (paymentIntentId, status) => {
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: paymentIntentId },
  });

  if (!payment) throw new Error("Payment not found");

  return prisma.payment.update({
    where: { razorpayOrderId: paymentIntentId },
    data: { status },
  });
};

module.exports = {
  createStripePaymentIntent,
  updatePaymentStatus,
};
