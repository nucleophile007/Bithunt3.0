export const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }
      next();  // Proceed to the next middleware or route handler
    };
  };
  