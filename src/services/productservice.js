const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addProductService = async ({
  name,
  description,
  price,
  image,
  stock,
  categoryId,
}) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(categoryId) },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      image,
      stock,
      categoryId: Number(categoryId),
    },
  });

  return newProduct;
};

const getAllProductsService = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      reviews: true,
    },
  });
  console.log(`Fetched ${products.length} products`);  // DEBUG LOG
  return products;
};

const getProductByIdService = async (id) => {
  console.log('getProductByIdService called with id:', id); // debug log
  return await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      reviews: true,
    },
  });
};

const updateProductService = async (id, updateData) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  if (updateData.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: Number(updateData.categoryId) },
    });

    if (!category) {
      throw new Error('Category not found');
    }
  }

  return await prisma.product.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteProductService = async (id) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  await prisma.product.delete({
    where: { id: Number(id) },
  });
};

const createBulkProductsservice = async (products) => {
  return await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
};

module.exports = {
  addProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  createBulkProductsservice,
};
