const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getWishlist(userId) {
  return await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
  });
}

async function addToWishlist(userId, productId) {
  try {
    return await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Product already in wishlist');
    }
    throw error;
  }
}

async function removeFromWishlist(userId, productId) {
  return await prisma.wishlist.delete({
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
