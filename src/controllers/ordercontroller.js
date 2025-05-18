const orderService = require('../services/orderservice');

async function createOrder(req, res) {
  try {
    const userId = req.user.userId;
    const { productId, quantity, amount } = req.body;

    if (!productId || !quantity || !amount) {
      return res.status(400).json({ error: 'productId, quantity, and amount are required' });
    }

    const order = await orderService.createOrder(userId, productId, quantity, amount);
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

async function getUserOrders(req, res) {
  try {
    const userId = req.user.userId;
    const orders = await orderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function getOrderById(req, res) {
  try {
    const userId = req.user.userId;
    const orderId = parseInt(req.params.id, 10);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await orderService.getOrderById(userId, orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

// New deleteOrder controller
async function deleteOrder(req, res) {
  try {
    const userId = req.user.userId;
    const orderId = parseInt(req.params.id, 10);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    // Check if order belongs to user
    const order = await orderService.getOrderById(userId, orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    await orderService.deleteOrder(orderId);
    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  deleteOrder,    // export deleteOrder
};
