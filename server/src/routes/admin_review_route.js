import express from "express";
import {
    deleteReviewAdmin,
    getReviewsAdmin,
    getReviewStatistics,
    updateReviewStatus
} from "../controllers/admin_review_controller.js";
import { adminMiddleware } from "../middleware/admin.js";
import { authMiddleware } from "../middleware/auth.js";

const admin_review_router = express.Router();

// Admin only routes - all require authentication and admin privileges
admin_review_router.get("/", authMiddleware, adminMiddleware, getReviewsAdmin);
admin_review_router.get("/stats", authMiddleware, adminMiddleware, getReviewStatistics);
admin_review_router.put("/:reviewId/status", authMiddleware, adminMiddleware, updateReviewStatus);
admin_review_router.delete("/:reviewId", authMiddleware, adminMiddleware, deleteReviewAdmin);

export { admin_review_router };
