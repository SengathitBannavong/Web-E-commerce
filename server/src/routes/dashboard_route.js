import express from 'express';
import { get_admin_dashboard, get_best_sellers, get_insights } from '../controllers/dashboard_controller.js';
import { adminMiddleware } from '../middleware/admin.js';
import { authMiddleware } from '../middleware/auth.js';

const dashboard_router = express.Router();

// Admin-only dashboard summary
dashboard_router.get('/', authMiddleware, adminMiddleware, get_admin_dashboard);
// Best sellers (admin)
dashboard_router.get('/best-sellers', authMiddleware, adminMiddleware, get_best_sellers);
// Insights (date-range, resources)
dashboard_router.get('/insights', authMiddleware, adminMiddleware, get_insights);

export { dashboard_router };
