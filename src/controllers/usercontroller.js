const authService = require('../services/userservice');

exports.register = async (req, res) => {
  const { email, password, name, role, username } = req.body;
  try {
    await authService.registerUser({ email, password, name, role, username });
    res.status(201).json({ message: 'Registration successful. Please check your email to verify.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.confirmEmail = async (req, res) => {
  const { confirmationCode } = req.params;
  try {
    await authService.verifyUser(confirmationCode);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // ✅ Destructure both token and user from loginUser
    const { token, user } = await authService.loginUser({ email, password });

    // ✅ Send both token and userId
    res.status(200).json({ token, userId: user.id, email: user.email, message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const { token, user } = await authService.loginUser({ email, password });

//     console.log("Login response:", { token, userId: user.id });  // << Add this to verify what is sent

//     res.status(200).json({ token, userId: user.id, message: 'Login successful' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

exports.profile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
