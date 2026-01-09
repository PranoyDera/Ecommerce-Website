import express from "express";
import { registerAdmin, loginAdmin, getAllUsers, deleteUser, bulkDeleteUsers, getAllOrders } from "../Controller/adminController.js";
import adminAuthMiddleware from "../Middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", getAllUsers);
router.delete("/delete/:userId", deleteUser);
router.post("/users/bulk-delete", bulkDeleteUsers);
router.get("/orders",getAllOrders);

export default router;
