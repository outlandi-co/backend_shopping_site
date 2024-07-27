import express from 'express';
import Membership from '../models/Membership.js';
import sendEmail from '../../sendEmail.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { dateStarted, expirationDate, planType, userId, userEmail, paymentMethodId } = req.body;

    // Check if a membership already exists for the user
    const existingMembership = await Membership.findOne({ userId });
    if (existingMembership) {
      return res.status(400).json({ error: 'User already has a membership' });
    }

    // Process payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Replace with the actual amount
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    const newMembership = new Membership({ dateStarted, expirationDate, planType, userId, userEmail });
    await newMembership.save();

    // Generate receipt content
    const receiptContent = `
      Thank you for signing up for a ${planType} membership.
      Membership Details:
      - Date Started: ${new Date(dateStarted).toLocaleDateString()}
      - Expiration Date: ${new Date(expirationDate).toLocaleDateString()}
      - Plan Type: ${planType}
    `;

    // Send receipt email
    await sendEmail({
      to: userEmail,
      subject: 'Membership Receipt',
      text: receiptContent,
    });

    res.status(201).json(newMembership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
