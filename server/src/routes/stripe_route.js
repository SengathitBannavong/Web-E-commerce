import express from 'express';
import { getActiveCart } from '../controllers/cart_controller.js';
import { checkout_middle } from '../controllers/checkout_controller.js';
import { createCheckoutSession, paymentConfirm, paymentCancel } from '../controllers/stripe_controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { createCODCheckout } from '../controllers/checkout_controller.js';
  
const stripeRouter = express.Router();

stripeRouter.post('/create-checkout-session', authMiddleware, getActiveCart ,checkout_middle, createCheckoutSession);
stripeRouter.post('/cod-checkout', authMiddleware, getActiveCart ,checkout_middle, createCODCheckout);
stripeRouter.get('/payment-success',  paymentConfirm);
stripeRouter.get('/payment-cancel',  paymentCancel);

export { stripeRouter };
