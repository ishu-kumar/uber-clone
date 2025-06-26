import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../config/env.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthrized" });
  }

  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (!isBlacklisted) {
    return res.status(401).json({ success: false, message: "Unauthrized" });
  }

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);

    req.user = user;

    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthrized" + error.message });
  }
};
