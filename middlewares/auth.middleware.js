import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";
import { Captain } from "../models/captain.model.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthrized" });
  }
  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (isBlacklisted) {
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
export const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await BlacklistToken.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const captain = await Captain.findById(decoded._id);
    req.captain = captain;
     
    return next();
  } catch (err) {
    console.log(err);

    res.status(401).json({ message: "Unauthorized" });
  }
};
