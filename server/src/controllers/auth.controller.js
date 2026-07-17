const User = require('../models/user.model');

exports.clerkLogin = async (req, res) => {
  try {
    const { clerkId, email, name, picture } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: 'clerkId and email are required' });
    }
    let user = await User.findOne({ $or: [{ clerkId }, { email }] });

    if (user) {
      if (!user.clerkId) {
        user.clerkId = clerkId;
      }
      if (picture) user.picture = picture;
      if (name) user.name = name;
      
      await user.save();
      return res.status(200).json({ message: 'Login successful', user });
    }

    user = new User({
      clerkId,
      email,
      name: name || 'User',
      picture
    });

    await user.save();
    return res.status(201).json({ message: 'User created successfully', user });
    
  } catch (error) {
    console.error('Error in clerk login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
