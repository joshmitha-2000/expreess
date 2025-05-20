const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addToCart(userId, productId, quantity) {
  const existingItem = await prisma.cart.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existingItem) {
    // Increment quantity
    return await prisma.cart.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true }
    });
  } else {
    // Create new cart item
    return await prisma.cart.create({
      data: { userId, productId, quantity },
      include: { product: true }
    });
  }
}

async function getCart(userId) {
  return await prisma.cart.findMany({
    where: { userId },
    include: { product: true }
  });
}

async function removeFromCart(userId, productId) {
  // If your Prisma schema has composite unique key on userId+productId, use delete:
  return await prisma.cart.deleteMany({
    where: { userId, productId }
  });
  // Or:
  // return await prisma.cart.delete({
  //   where: { userId_productId: { userId, productId } }
  // });
}

async function updateQuantity(userId, productId, quantity) {
  if (quantity < 1) {
    // Delete item if quantity < 1
    return await prisma.cart.deleteMany({
      where: { userId, productId }
    });
  }

  const existingItem = await prisma.cart.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (!existingItem) {
    return null;
  }

  return await prisma.cart.update({
    where: { id: existingItem.id },
    data: { quantity }
  });
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
};
