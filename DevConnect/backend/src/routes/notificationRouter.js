import express from "express";
import * as notificationController from "../controllers/notificationController.js";
import protect from "../middlewares/authMiddleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, notificationController.getNotifications);
notificationRouter.put("/:id/read", protect, notificationController.markAsRead);
notificationRouter.put(
  "/read-all",
  protect,
  notificationController.markAllAsRead,
);

export default notificationRouter;
