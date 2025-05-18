const categoryService = require('../services/categoryservice');

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await categoryService.createCategory(name);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error in createCategory:', error); // ✅ Add this line
    res.status(500).json({ error: 'Failed to create category' });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await categoryService.updateCategory(id, name);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
const bulkAddCategories = async (req, res) => {
  const { categories } = req.body;  // Expecting { categories: [ { id?, name }, ... ] }

  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ error: 'Categories must be a non-empty array' });
  }

  // Optional: validate each category
  for (const cat of categories) {
    if (!cat.name || typeof cat.name !== 'string') {
      return res.status(400).json({ error: 'Each category must have a valid name' });
    }
  }

  try {
    const result = await categoryService.bulkAddCategories(categories);
    res.status(201).json({ message: 'Categories added successfully', insertedCount: result.count });
  } catch (error) {
    console.error('Error in bulkAddCategories:', error);
    res.status(500).json({ error: 'Failed to add categories' });
  }
};

module.exports = {
  // existing exports...
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  bulkAddCategories, // add this export
};
