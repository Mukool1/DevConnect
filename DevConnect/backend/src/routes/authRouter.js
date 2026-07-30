import express from "express";
import * as authController from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import validateRequest from "../middlewares/validateRequest.js";
import protect from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  registerValidator,
  validateRequest,
  authController.register,
);
authRouter.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login,
);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", protect, authController.getMe);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.put("/reset-password/:token", authController.resetPassword);

export default authRouter;
