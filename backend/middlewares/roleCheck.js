/**
 * Implements role-based access control (RBAC) for the application.
 */

const roleCheck = (requiredRole) => async (req, res, next) => {
  try {
    const userRole = req.userRecord.role;
    console.log(`User role: ${userRole}`);
    console.log(`Required role: ${requiredRole}`);
    // Check the user's role
    if (userRole !== requiredRole) {
      return res.status(403).json({ message: 'Access forbidden: insufficient role.' });
    }

    next();
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default roleCheck;
