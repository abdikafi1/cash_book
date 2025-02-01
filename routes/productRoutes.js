const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const router = express.Router();

// Protect and authorize for Admin role
router
  .route('/')
  .get(protect, getProducts) // Users can view products, no admin check here
  .post(protect, authorize('admin'), createProduct); // Only admin can create products

router
  .route('/:id')
  .put(protect, authorize('admin'), updateProduct)  // Only admin can update product
  .delete(protect, authorize('admin'), deleteProduct); // Only admin can delete product

module.exports = router;
