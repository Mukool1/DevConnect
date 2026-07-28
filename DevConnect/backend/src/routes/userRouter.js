import express from "express";
import * as userController from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/:username", userController.getProfile);
userRouter.post("/profile/update", protect, userController.updateProfile);
userRouter.post("/follow/:id", protect, userController.followUser);
userRouter.post("/unfollow/:id", protect, userController.unfollowUser);

export default userRouter;
