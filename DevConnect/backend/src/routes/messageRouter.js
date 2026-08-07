import express from "express";
import * as messageController from "../controllers/messageController.js";
import protect from "../middlewares/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.get(
  "/conversations",
  protect,
  messageController.getConversations,
);
messageRouter.get("/:userId", protect, messageController.getMessages);
messageRouter.post("/:userId", protect, messageController.sendMessage);

export default messageRouter;
