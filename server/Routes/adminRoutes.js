import express from "express";
import { registerAdmin, loginAdmin, getAllUsers } from "../Controller/adminController.js";
import adminAuthMiddleware from "../Middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", getAllUsers);

export default router;
