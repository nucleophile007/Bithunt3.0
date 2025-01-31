import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // If you need user details later

export const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId and role to the request object
    req.userId = decoded.userId;
    req.role = decoded.role;

    // Optionally, fetch the user to add user details if needed later (for example, in authorization checks)
    // const user = await User.findById(decoded.userId);
    // req.user = user; // Attach user object if needed

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
