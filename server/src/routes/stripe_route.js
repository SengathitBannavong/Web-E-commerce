import express from 'express';
import { getActiveCart } from '../controllers/cart_controller.js';
import { checkout_middle } from '../controllers/checkout_controller.js';
import { createCheckoutSession, paymentConfirm, paymentCancel } from '../controllers/stripe_controller.js';
import { authMiddleware } from '../middleware/auth.js';
  
const stripeRouter = express.Router();

stripeRouter.post('/create-checkout-session', authMiddleware, getActiveCart ,checkout_middle, createCheckoutSession);
stripeRouter.get('/payment-success',  paymentConfirm);
stripeRouter.get('/payment-cancel',  paymentCancel);

export { stripeRouter };
