require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma, seedAdminUser } = require('./prisma/prismaclient'); // Destructure properly
const userRoutes = require('./src/routes/userroute');
const productRoutes = require('./src/routes/productroutes');
const categoryRoutes = require('./src/routes/categoryruotes');
const cartRoutes = require('./src/routes/cartruoter');
const wishlist = require('./src/routes/wishlistroute');
const reviewRoutes = require('./src/routes/reviewroutes');
const orderRoutes = require('./src/routes/orderroutes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Seed Admin User (handle errors)
seedAdminUser(prisma).catch((err) => {
  console.error('Error seeding admin user:', err);
});

// Routes
app.use('/', userRoutes); 
app.use(productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/cart', cartRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/wishlist', wishlist);
app.use('/api/reviews', reviewRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;

// If you have a connectDB function (for example, to connect to MongoDB), define or import it.
// If you don't need it, just listen directly:
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
