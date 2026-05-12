import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// PROTECTED ROUTES - Seller
router.post('/', authenticate, upload.array('images', 5), productController.createProduct);
router.put('/:id', authenticate, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

// PUBLIC - Reviews
router.post('/:id/review', authenticate, productController.reviewProduct);

export default router;
