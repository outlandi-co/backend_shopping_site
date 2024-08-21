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

exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch memberships', error });
  }
};

exports.deleteMembership = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMembership = await Membership.findByIdAndDelete(id);
    if (!deletedMembership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete membership', error });
  }
};
