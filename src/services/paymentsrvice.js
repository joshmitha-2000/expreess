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

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const Stripe = require('stripe');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const createStripeCheckoutSession = async (orderId) => {
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: {
//       product: true,
//     },
//   });

//   if (!order) throw new Error("Order not found");

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: order.product.name,
//             description: order.product.description,
//           },
//           unit_amount: Math.round(order.amount * 100),
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     metadata: {
//       orderId: order.id.toString(),
//       userId: order.userId.toString(),
//     },
//     success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//   });

//   await prisma.payment.create({
//     data: {
//       orderId: order.id,
//       razorpayOrderId: session.id, // Reusing field name
//       amount: order.amount,
//       status: "created",
//     },
//   });

//   return session.url;
// };

// const updatePaymentStatus = async (sessionId, status) => {
//   const payment = await prisma.payment.findUnique({
//     where: { razorpayOrderId: sessionId },
//   });

//   if (!payment) throw new Error("Payment not found");

//   return prisma.payment.update({
//     where: { razorpayOrderId: sessionId },
//     data: { status },
//   });
// };

// module.exports = {
//   createStripeCheckoutSession,
//   updatePaymentStatus,
// };
