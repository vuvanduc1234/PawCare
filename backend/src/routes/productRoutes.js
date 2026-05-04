import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// PROTECTED ROUTES - Seller
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

// PUBLIC - Reviews
router.post('/:id/review', authenticate, productController.reviewProduct);

export default router;
