import { verifyToken } from "../config/jwt.js";
import User from "../libs/models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};

export const schoolAccess = async (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }

  if (
    req.params.schoolId &&
    req.user.schoolId.toString() !== req.params.schoolId
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized access to this school" });
  }

  next();
};
