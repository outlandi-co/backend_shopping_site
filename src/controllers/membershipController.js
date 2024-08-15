const Membership = require('../models/Membership');

exports.createMembership = async (req, res) => {
  const { type, price, duration } = req.body;
  try {
    const membership = new Membership({
      type,
      price,
      duration,
    });

    const createdMembership = await membership.save();
    res.status(201).json(createdMembership);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create membership', error });
  }
};
