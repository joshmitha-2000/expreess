const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrder(userId, productId, quantity, amount) {
  return prisma.order.create({
    data: {
      userId,
      productId,
      amount,
      status: 'paid',
      quantity,
    },
  });
}

async function getOrdersByUser(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      product: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function getOrderById(userId, orderId) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      product: true,
    },
  });
}

// New: deleteOrder service
async function deleteOrder(orderId) {
  return prisma.order.delete({
    where: { id: orderId },
  });
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  deleteOrder,   // export deleteOrder
};
