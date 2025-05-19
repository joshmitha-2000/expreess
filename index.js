// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const prisma = require('./prisma/prismaclient');
const { seedAdminUser } = require('./prisma/prismaclient'); // destructure seeding function
const userRoutes = require('./src/routes/userroute');
const productRoutes = require('./src/routes/productroutes');
const categoryRoutes = require('./src/routes/categoryruotes');
const cartRoutes = require('./src/routes/cartruoter');
const wishlist = require('./src/routes/wishlistroute');
const reviewRoutes = require('./src/routes/reviewroutes');
const orderRoutes = require('./src/routes/orderroutes');

const app = express();

app.use(cors({ origin: '*', credentials: true })); // Change origin before prod
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Consider cloud storage for production

// Seed Admin only if not in production
if (process.env.NODE_ENV !== 'production') {
  seedAdminUser(prisma).catch((e) => {
    console.error('Seeding admin user failed:', e);
  });
}

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/', userRoutes);
app.use(productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlist);
app.use('/api/reviews', reviewRoutes);
app.use('/orders', orderRoutes);

// Export as serverless handler for Vercel
module.exports.handler = serverless(app);
