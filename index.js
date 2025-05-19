// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/prismaclient'); // Prisma client
const seedAdminUser = require('./prisma/prismaclient'); // Admin seeding

const userRoutes = require('./src/routes/userroute');
const productRoutes = require('./src/routes/productroutes');
const categoryRoutes = require('./src/routes/categoryruotes');
const cartRoutes = require('./src/routes/cartruoter');
const wishlistRoutes = require('./src/routes/wishlistroute');
const reviewRoutes = require('./src/routes/reviewroutes');
const orderRoutes = require('./src/routes/orderroutes');

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/', userRoutes);
app.use(productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/orders', orderRoutes);

// Seed Admin (optional, wrap in async if needed)
seedAdminUser(prisma);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
