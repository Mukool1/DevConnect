import express from "express";
import * as postController from "../controllers/postController.js";
import {
  createPostValidator,
  commentValidator,
} from "../validators/postValidator.js";
import validateRequest from "../middlewares/validateRequest.js";
import protect from "../middlewares/authMiddleware.js";

const postRouter = express.Router();

postRouter.post(
  "/",
  protect,
  createPostValidator,
  validateRequest,
  postController.createPost,
);
postRouter.get("/feed", protect, postController.getFeed);
postRouter.delete("/:id", protect, postController.deletePost);
postRouter.put("/:id/like", protect, postController.likePost);
postRouter.post(
  "/:id/comment",
  protect,
  commentValidator,
  validateRequest,
  postController.addComment,
);

export default postRouter;
