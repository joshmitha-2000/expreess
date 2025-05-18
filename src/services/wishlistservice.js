const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getWishlist(userId) {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          reviews: true,
        },
      },
    },
  });
}

async function addToWishlist(userId, productId) {
  if (!userId || !productId) {
    throw new Error('userId and productId are required');
  }

  // Check if wishlist item already exists
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    return existing; // already in wishlist, return existing
  }

  return prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });
}

async function removeFromWishlist(userId, productId) {
  if (!userId || !productId) {
    throw new Error('userId and productId are required');
  }

  return prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

