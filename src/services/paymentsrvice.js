const { PrismaClient } = require('@prisma/client');
const stripe = require('../utils/stripe');

const prisma = new PrismaClient();

const createPayment = async (userId, productId, quantity = 1) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || product.stock < quantity) {
    throw new Error('Product not available or out of stock');
  }

  const amount = product.price * quantity;

  // Create Order in DB
  const order = await prisma.order.create({
    data: {
      userId,
      productId,
      amount,
      quantity,
      status: 'PENDING',
    },
  });

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // amount in paise
    currency: 'inr',
    metadata: { orderId: order.id.toString() },
  });

  // Save payment info in DB
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: paymentIntent.id, // using this field for stripe paymentIntent id
      amount,
      status: 'created',
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  };
};

const updatePaymentStatus = async (paymentIntentId, status) => {
  const payment = await prisma.payment.update({
    where: { razorpayOrderId: paymentIntentId },
    data: { status },
  });

  // Update order status accordingly
  if (status === 'succeeded') {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'COMPLETED' },
    });
  } else if (status === 'failed') {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'FAILED' },
    });
  }

  return payment;
};

module.exports = {
  createPayment,
  updatePaymentStatus,
};

