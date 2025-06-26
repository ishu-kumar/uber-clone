import express from "express";
const router = express.Router();
import { body } from "express-validator";
import {
  grtUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 chracters long"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 6 chracters long"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chracters long"),
  ],
  loginUser
);

router.get("/profile", authUser, grtUserProfile);

router.get("/logout", logoutUser);

export default router;
