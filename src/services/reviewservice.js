const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createReview(userId, productId, rating, comment) {
  return await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });
}

async function getReviewsByProduct(productId) {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { username: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

module.exports = {
  createReview,
  getReviewsByProduct,
};
