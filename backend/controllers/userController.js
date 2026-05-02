import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['admin', 'member'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either admin or member' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    const updatedUser = await user.save();

    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};
