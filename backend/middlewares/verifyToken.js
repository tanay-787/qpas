import { admin } from '../config/firebase.js';

/**
 * Verify the token and set the firebase user data in the request object
 */

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
    
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default verifyToken;
