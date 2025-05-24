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
const paymentRoutes = require('./src/routes/paymentroutes');


const app = express();


app.use(express.json());  


// Middlewares
const allowedOrigins = [
  'http://localhost:5173', // for local dev
  'https://fresco-frontend.vercel.app' // your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/payments/webhook', paymentRoutes);
app.use('/', userRoutes);
app.use(productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);


// Seed Admin (optional, wrap in async if needed)
seedAdminUser(prisma);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
