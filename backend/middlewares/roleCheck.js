/**
 * Implements role-based access control (RBAC) for the application.
 */

const roleCheck = (requiredRole) => async (req, res, next) => {
  try {
    // Check the user's role
    if (req.userRecord.role !== requiredRole) {
      return res.status(403).json({ message: 'Access forbidden: insufficient role.' });
    }

    next();
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default roleCheck;
