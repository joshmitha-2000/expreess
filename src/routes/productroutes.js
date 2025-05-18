const express = require('express');
const router = express.Router();

const {
  addProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  createBulkProducts,
} = require('../controllers/productcontoller');

router.post('/products', addProductController);
router.get('/products', getAllProductsController);
router.get('/products/:id', getProductByIdController);
router.put('/products/:id', updateProductController);
router.delete('/products/:id', deleteProductController);
router.post('/products/bulk', createBulkProducts);

module.exports = router;
