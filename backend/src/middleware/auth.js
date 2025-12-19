// backend/src/middleware/auth.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tambahkan data user ke request object
    req.user = decoded; 
    
    next(); // Lanjut ke request berikutnya
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
