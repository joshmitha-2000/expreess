const wishlistService = require('../services/wishlistservice');

async function getWishlist(req, res) {
    const userId = req.user.userId;
    try {
      const wishlist = await wishlistService.getWishlist(userId);
      return res.json(wishlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  }
  
async function addToWishlist(req, res) {
  const userId = req.user.userId; // from middleware
  const productId = parseInt(req.body.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid productId' });
  }

  try {
    const wishlistItem = await wishlistService.addToWishlist(userId, productId);
    return res.status(201).json(wishlistItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to add to wishlist' });
  }
}

async function removeFromWishlist(req, res) {
  const userId = req.user.userId; // from middleware
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid productId' });
  }

  try {
    await wishlistService.removeFromWishlist(userId, productId);
    return res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
