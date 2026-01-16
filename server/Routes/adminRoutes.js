import express from "express";
import { registerAdmin, loginAdmin, getAllUsers, deleteUser, bulkDeleteUsers, getAllOrders, getTopPurchasedProducts, updateAdminProfile, getAdminProfile } from "../Controller/adminController.js";
import adminAuthMiddleware from "../Middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", getAllUsers);
router.delete("/delete/:userId", deleteUser);
router.post("/users/bulk-delete", bulkDeleteUsers);
router.get("/orders",getAllOrders);
router.get("/top-products",getTopPurchasedProducts);
router.put("/profile",adminAuthMiddleware, updateAdminProfile);
router.get("/profile",adminAuthMiddleware,getAdminProfile);

export default router;
