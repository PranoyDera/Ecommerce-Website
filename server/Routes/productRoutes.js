import express from 'express';
import { bulkDeleteProducts, createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../Controller/productsController.js';

const router = express.Router();

router.get('/',getProducts);
router.get('/:id',getProductById);
router.post('/create',createProduct);
router.put('/update/:id',updateProduct);
router.delete('/delete/:id',deleteProduct);
router.post('/bulk-delete',bulkDeleteProducts);

export default router;