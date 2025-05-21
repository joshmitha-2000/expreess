require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPaymentIntent({ userId, orderId }) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });

  console.log("Order fetched in service:", order);
  console.log("Order userId:", order?.userId, "Type:", typeof order?.userId);
  console.log("UserId from token:", userId, "Type:", typeof userId);

  if (!order) throw new Error("Order not found");
  if (Number(order.userId) !== Number(userId)) throw new Error("Unauthorized access to order");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.amount * 100),
    currency: "inr",
    metadata: {
      orderId: String(order.id),
      userId: String(userId),
      productId: String(order.productId),
    },
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: paymentIntent.id,
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
        userId: Number(userId),
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
  if (Number(payment.order.userId) !== Number(userId)) throw new Error("Unauthorized access to payment");

  return payment;
}

module.exports = {
  createPaymentIntent,
  getPaymentsByUser,
  getPaymentById,
};
