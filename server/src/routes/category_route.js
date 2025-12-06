import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories, updateCategory
} from '../controllers/category_controller.js';

const category_router = express.Router();

category_router.get('/', getCategories);
category_router.get('/:id', getCategories);
category_router.post('/', createCategory);
category_router.put('/:id', updateCategory);
category_router.delete('/:id', deleteCategory);

export { category_router };
