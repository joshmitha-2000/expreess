// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/prismaclient'); // Import the Prisma client
const seedAdminUser = require('./prisma/prismaclient'); // Import from the same file
const userRoutes = require('./src/routes/userroute');
const productRoutes = require('./src/routes/productroutes');
const categoryRoutes = require('./src/routes/categoryruotes');
const cartRoutes= require('./src/routes/cartruoter');
const wishlist = require('./src/routes/wishlistroute');
const reviewRoutes =require('./src/routes/reviewroutes');
const orderRoutes=require('./src/routes/orderroutes')

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Seed Admin
seedAdminUser(prisma); // Pass the prisma instance
// Routes
app.use('/', userRoutes); 
app.use(productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/cart',cartRoutes);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
app.use("/wishlist", wishlist);
app.use('/api/reviews', reviewRoutes);
app.use("/orders", orderRoutes);
module.exports = app;