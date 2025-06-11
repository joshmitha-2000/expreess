const authService = require('../services/userservice');

// Register Controller
exports.register = async (req, res) => {
  const { email, password, name, role, username } = req.body;
  try {
    await authService.registerUser({ email, password, name, role, username });
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) {
    // Customize Prisma duplicate email error
    if (
      err.code === 'P2002' &&
      err.meta?.target?.includes('email')
    ) {
      return res.status(400).json({
        message: 'Email already exists. Please log in or use another email.',
      });
    }

    res.status(400).json({ message: err.message || 'Registration failed' });
  }
};

// Email Verification Controller
exports.confirmEmail = async (req, res) => {
  const { confirmationCode } = req.params;
  try {
    await authService.verifyUser(confirmationCode);
    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Verification failed.' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await authService.loginUser({ email, password });

    res.status(200).json({
      token,
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      message: 'Login successful',
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Login failed' });
  }
};

// Profile Controller
exports.profile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message || 'User not found' });
  }
};
