const { PrismaClient } = require('@prisma/client');
const stripe = require('../utils/stripe'); // your stripe setup

const prisma = new PrismaClient();

async function createPayment(userId, productId, quantity = 1) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < quantity) {
    throw new Error('Product not available or out of stock');
  }

  const amount = product.price * quantity;

  const order = await prisma.order.create({
    data: {
      userId,
      productId,
      amount,
      quantity,
      status: 'PENDING',
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'inr',
    metadata: { orderId: order.id.toString() },
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      razorpayOrderId: paymentIntent.id, // storing stripe paymentIntent id here
      amount,
      status: 'created',
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
  };
}

async function updatePaymentStatus(paymentIntentId, status) {
  const payment = await prisma.payment.update({
    where: { razorpayOrderId: paymentIntentId },
    data: { status },
  });

  if (status === 'succeeded') {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'paid' },
    });
  } else if (status === 'failed') {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'failed' },
    });
  }

  return payment;
}

module.exports = {
  createPayment,
  updatePaymentStatus,
};
