const express = require('express');
const Membership = require('../models/Membership');

const router = express.Router();

// Create a new membership
router.post('/', async (req, res) => {
  const { dateStarted, expirationDate, planType } = req.body;

  try {
    const newMembership = new Membership({ dateStarted, expirationDate, planType });
    await newMembership.save();
    res.status(201).json(newMembership);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all memberships
router.get('/', async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.status(200).json(memberships);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
