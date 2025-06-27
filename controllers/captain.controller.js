import { validationResult } from "express-validator";
import { Captain } from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";

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
