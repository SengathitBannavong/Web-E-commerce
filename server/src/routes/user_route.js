import express from "express";
import {
  change_password_admin,
  change_password_self,
  create_user,
  delete_user,
  get_current_user,
  get_user,
  login_user,
  update_user
} from "../controllers/user_controller.js";
import { adminMiddleware } from "../middleware/admin.js";
import { authMiddleware } from "../middleware/auth.js";

const user_router = express.Router();

// ==================== PUBLIC ROUTES ====================
user_router.post("/register", create_user);
user_router.post("/login", login_user);

// ==================== USER ROUTES (auth required) ====================
user_router.get("/me", authMiddleware, get_current_user);
user_router.put("/me", authMiddleware, update_user); // User can update own profile
user_router.post("/change_password", authMiddleware, change_password_self); // User change own password

// ==================== ADMIN ROUTES ====================
user_router.get("/", authMiddleware, adminMiddleware, get_user); // Get all users
user_router.post("/", authMiddleware, adminMiddleware, create_user); // Admin create user
user_router.put("/:id", authMiddleware, adminMiddleware, update_user); // Admin update any user
user_router.delete("/:id", authMiddleware, adminMiddleware, delete_user); // Admin delete user

// Admin change password for any user
user_router.post("/:id/change_password", authMiddleware, adminMiddleware, change_password_admin);


export { user_router };
