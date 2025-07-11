import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  const { firstname, lastname = "" } = fullname;

  const isMatch = await User.findOne({ email });
  if (isMatch) {
    return res.status(400).json({
      message: "User already registered",
    });
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ success: true, token: token, user: user });
};

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ token, user });
};

export const logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await BlacklistToken.create({ token: token });

  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};

export const grtUserProfile = async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
};
