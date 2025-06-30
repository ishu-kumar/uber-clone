import { validationResult } from "express-validator";
import { Captain } from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";

export const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }
  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlreadyExist = await Captain.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res
      .status(400)
      .json({ success: false, message: "Captain already exist" });
  }

  const hashedPassword = await Captain.hashPassword(password);

  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = await captain.generateAuthToken();

  res.status(201).json({ success: true, token: token, captain });
};

export const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  const token = await captain.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ token, captain });
};

export const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log(token)
  await BlacklistToken.create({ token });

  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};

export const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ success: true, data: req.captain });
};
