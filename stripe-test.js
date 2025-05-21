require('dotenv').config();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // amount in paise (₹50)
      currency: 'inr',
      payment_method_types: ['card'],
    });

    console.log('✅ Stripe is working. Client secret:');
    console.log(paymentIntent.client_secret);
  } catch (error) {
    console.error('❌ Stripe test failed:');
    console.error(error);
  }
}

testStripe();
