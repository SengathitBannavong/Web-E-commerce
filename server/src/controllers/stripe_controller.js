import Stripe from 'stripe';
import { getModel } from '../config/database.js';
import { CLIENT_URL, STRIPE_SECRET_KEY } from '../config/env.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderItems, userId } = req;

    const lineItems = orderItems.map((product) => ({
      price_data: {
        currency: 'vnd',
        product_data: {
          name: product.productName, // Product name
          // images: [product.image],
        },
        unit_amount: Math.round(parseFloat(product.Amount)), 
      },
      quantity: product.Quantity,
    }));

    // build safe origin from request (supports reverse proxies)
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const host = req.get('host');
    const origin = `${protocol}://${host}`;

    const successUrl = `${origin}/api/payment-gateway/payment-success?session_id={CHECKOUT_SESSION_ID}`;


    // สร้าง Session การจ่ายเงิน
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // made success url call myself
      success_url: successUrl,
      cancel_url: `${CLIENT_URL}/checkout`,
      metadata: {
        userId: userId,
        orderId: req.order.Order_Id,
      },
    });

    console.log("Stripe Session Created:", session);

    // send session url to client
    res.json({ url: session.url });

    // Commit the transaction after successful session creation
    await req.transaction.commit();

  } catch (error) {
    console.error("Stripe Error:", error);
    // Rollback transaction on error
    if (req.transaction) {
      await req.transaction.rollback();
    }
    res.status(500).json({ error: error.message });
  }
};

// at top of file stripe is already created
export const paymentConfirm = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) return res.status(400).send('Missing session_id');

    

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).send('Payment not completed');
    }

    // use metadata/order data from session to find & update order
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;
    const { Order } = getModel();

    const order = await Order.findOne({ where: { Order_Id: orderId, User_Id: userId } });
    if (!order) return res.status(404).send('Order not found');

    order.Status = 'paid';
    await order.save();

    // Redirect to customer frontend payment success page
    return res.redirect(`${CLIENT_URL}/payment-success?order_id=${order.Order_Id}&session_id=${sessionId}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error confirming payment');
  }
};