const {
  addProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  createBulkProductsservice,
} = require('../services/productservice');

const addProductController = async (req, res) => {
  try {
    const product = await addProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in addProductController:', error.message || error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (error) {
    console.error('Error in getAllProductsController:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing product ID' });
    }

    const product = await getProductByIdService(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error in getProductByIdController:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

const updateProductController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing product ID' });
    }

    const updatedProduct = await updateProductService(id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProductController:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing product ID' });
    }

    await deleteProductService(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProductController:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const createBulkProducts = async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Products array is required and cannot be empty.' });
  }

  try {
    await createBulkProductsservice(products);
    res.status(201).json({ message: 'Products added successfully.' });
  } catch (error) {
    console.error('Error in createBulkProducts:', error);
    res.status(500).json({ error: 'Failed to add products.' });
  }
};

module.exports = {
  addProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  createBulkProducts,
};
