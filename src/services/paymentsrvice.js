require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPaymentIntent({ userId, orderId }) {
  // 1. Fetch the order with product
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Unauthorized access to order");
  
  // 2. Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.amount * 100), // amount in cents
    currency: "inr",
    metadata: {
      orderId: String(order.id),
      userId: String(userId),
      productId: String(order.productId),
    },
  });

  // 3. Create payment record in DB
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: paymentIntent.id,  // Store Stripe PaymentIntent ID here
      amount: order.amount,
      status: "created",
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentId: payment.id,
    orderId: order.id,
    productName: order.product.name,
    amount: order.amount,
  };
}

async function getPaymentsByUser(userId) {
  return prisma.payment.findMany({
    where: {
      order: {
        userId: userId,
      },
    },
    include: {
      order: {
        include: {
          product: true,
        },
      },
    },
  });
}

async function getPaymentById(userId, paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        include: { product: true },
      },
    },
  });

  if (!payment) throw new Error("Payment not found");
  if (payment.order.userId !== userId) throw new Error("Unauthorized");

  return payment;
}

module.exports = {
  createPaymentIntent,
  getPaymentsByUser,
  getPaymentById,
};
