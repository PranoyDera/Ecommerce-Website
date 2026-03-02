import express from 'express';
import { upload } from "../Middleware/uploadMiddleware.js";
import { addProductReview, bulkDeleteProducts, createProduct, deleteProduct, deleteProductReview, getProductById, getProducts, updateProduct } from '../Controller/productsController.js';

const router = express.Router();

router.get('/',getProducts);
router.get('/:id',getProductById);
router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProduct
);
router.put(
  "/update/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateProduct
);
router.delete('/delete/:id',deleteProduct);
router.post('/bulk-delete',bulkDeleteProducts);
router.post("/review/:id",addProductReview);
router.delete("/products/:productId/reviews/:reviewId",deleteProductReview);

export default router;