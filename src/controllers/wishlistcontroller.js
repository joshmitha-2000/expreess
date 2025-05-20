const wishlistService = require('../services/wishlistservice');

// Get wishlist for a user
async function getWishlist(req, res) {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const wishlist = await wishlistService.getWishlist(userId);
    return res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    return res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
}

// Add a product to wishlist
async function addToWishlist(req, res) {
  const userId = parseInt(req.params.userId, 10);
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(userId) || isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid userId or productId' });
  }

  try {
    const wishlistItem = await wishlistService.addToWishlist(userId, productId);
    return res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error.message);

    if (error.message.includes('already in wishlist')) {
      return res.status(409).json({ error: 'Product already in wishlist' });
    }

    return res.status(500).json({ error: 'Failed to add to wishlist' });
  }
}

// Remove a product from wishlist
async function removeFromWishlist(req, res) {
  const userId = parseInt(req.params.userId, 10);
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(userId) || isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid userId or productId' });
  }

  try {
    await wishlistService.removeFromWishlist(userId, productId);
    return res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    return res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
