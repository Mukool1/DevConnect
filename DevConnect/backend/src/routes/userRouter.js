import express from "express";
import * as userController from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/:username", userController.getProfile);
userRouter.get("/:username/followers", protect, userController.getFollowers);
userRouter.get("/:username/following", protect, userController.getFollowing);
userRouter.put("/profile/update", protect, userController.updateProfile);
userRouter.put("/follow/:id", protect, userController.followUser);
userRouter.put("/unfollow/:id", protect, userController.unfollowUser);

export default userRouter;
