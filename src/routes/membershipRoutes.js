import express from 'express';
import Membership from '../models/Membership.js';

const router = express.Router();

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
    const { dateStarted, expirationDate, planType } = req.body;

    // Check if a membership already exists for the user (assuming some unique user identifier, e.g., userId)
    const existingMembership = await Membership.findOne({ userId: req.body.userId });
    if (existingMembership) {
      return res.status(400).json({ error: 'User already has a membership' });
    }

    const newMembership = new Membership({ dateStarted, expirationDate, planType, userId: req.body.userId });
    await newMembership.save();
    res.status(201).json(newMembership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
