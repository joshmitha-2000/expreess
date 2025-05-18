const cartService = require('../services/cartservice');

async function addToCart(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const { productId, quantity } = req.body;

    if (!(userId > 0 && productId > 0 && quantity > 0)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    const addedItem = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json(addedItem);
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getCartController(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    if (!(userId > 0)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function removeFromCartController(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);

    if (!(userId > 0 && productId > 0)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    await cartService.removeFromCart(userId, productId);
    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateQuantityController(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    const quantity = parseInt(req.body.quantity);

    if (!(userId > 0 && productId > 0 && quantity >= 0)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const result = await cartService.updateQuantity(userId, productId, quantity);

    if (!result) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: quantity === 0 ? 'Product removed from cart' : 'Quantity updated' });
  } catch (error) {
    console.error('Error updating quantity:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  addToCart,
  getCartController,
  removeFromCartController,
  updateQuantityController,
};
