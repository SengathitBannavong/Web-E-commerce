import express from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories, updateCategory
} from '../controllers/category_controller.js';
import { adminMiddleware } from '../middleware/admin.js';
import { authMiddleware } from '../middleware/auth.js';

const category_router = express.Router();

// Public routes - anyone can view categories
category_router.get('/', getCategories);
category_router.get('/:id', getCategories);

// Admin only routes - create, update, delete categories
category_router.post('/', authMiddleware, adminMiddleware, createCategory);
category_router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
category_router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export { category_router };
