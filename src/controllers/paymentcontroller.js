// const {
//   createStripePaymentIntent,
//   updatePaymentStatus,
// } = require("../services/paymentsrvice");

// const createPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const clientSecret = await createStripePaymentIntent(orderId);
//     res.json({ clientSecret });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// const handleStripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.log('⚠️ Webhook signature verification failed.', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object;
//     await updatePaymentStatus(paymentIntent.id, "paid");
//   } else if (event.type === "payment_intent.payment_failed") {
//     const paymentIntent = event.data.object;
//     await updatePaymentStatus(paymentIntent.id, "failed");
//   }

//   res.sendStatus(200);
// };

// module.exports = {
//   createPayment,
//   handleStripeWebhook,
// };

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const {
  createStripeCheckoutSession,
  updatePaymentStatus,
} = require('../services/paymentsrvice');

const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const sessionUrl = await createStripeCheckoutSession(orderId);
    res.json({ url: sessionUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await updatePaymentStatus(session.id, 'paid');
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    await updatePaymentStatus(session.id, 'failed');
  }

  res.sendStatus(200);
};

module.exports = {
  createPayment,
  handleStripeWebhook,
};

