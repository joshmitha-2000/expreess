const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCategory = async (name) => {
  return await prisma.category.create({ data: { name } });
};

const getAllCategories = async () => {
  return await prisma.category.findMany();
};

const getCategoryById = async (id) => {
  return await prisma.category.findUnique({ where: { id: Number(id) } });
};

const updateCategory = async (id, name) => {
  return await prisma.category.update({
    where: { id: Number(id) },
    data: { name },
  });
};

const deleteCategory = async (id) => {
  return await prisma.category.delete({ where: { id: Number(id) } });
};
const bulkAddCategories = async (categories) => {
  // categories is expected as array of { id?, name }
  // If your Prisma schema has id as auto-increment, don't pass id here
  return await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,  // optional: skip duplicates (by unique constraints)
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  bulkAddCategories, 
};
