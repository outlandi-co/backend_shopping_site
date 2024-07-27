import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processStripePayment = async (req, res) => {
  try {
    const { amount, currency, source } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: source,
      confirm: true
    });

    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Error processing Stripe payment:', error);
    return { success: false, error: 'Internal Server Error' };
  }
};
