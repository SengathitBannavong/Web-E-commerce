import express from "express";
import {
    createReview,
    deleteReview,
    getProductReviews,
    getReviewStats,
    markReviewHelpful,
    updateReview
} from "../controllers/review_controller.js";
import { authMiddleware } from "../middleware/auth.js";

const review_router = express.Router();

// Public routes - anyone can view reviews and stats
review_router.get("/product/:productId", getProductReviews);
review_router.get("/product/:productId/stats", getReviewStats);

// Authenticated routes - logged in users can manage their reviews
review_router.post("/", authMiddleware, createReview);
review_router.put("/:reviewId", authMiddleware, updateReview);
review_router.delete("/:reviewId", authMiddleware, deleteReview);
review_router.post("/:reviewId/helpful", authMiddleware, markReviewHelpful);

export { review_router };
