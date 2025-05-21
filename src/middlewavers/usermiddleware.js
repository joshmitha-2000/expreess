const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid or expired' });

    req.user = { userId: user.id, email: user.email, role: user.role };

    // Log here before next()
    console.log('Auth token:', req.headers.authorization);
    console.log('User payload:', req.user);

    next();
  });
}

module.exports = authenticateToken;
