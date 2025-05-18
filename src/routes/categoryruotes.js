// src/routes/categoryroutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categogrycontroller');

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
// Add this line along with your other routes
router.post('/bulk-add', categoryController.bulkAddCategories);


module.exports = router;
