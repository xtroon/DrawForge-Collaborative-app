const User = require('../models/user.model');

// Update user details (e.g., name)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};
