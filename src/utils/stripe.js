require('dotenv').config();
console.log("Stripe Key from env:", process.env.STRIPE_SECRET_KEY); // 🔍 Debug

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

module.exports = stripe;
