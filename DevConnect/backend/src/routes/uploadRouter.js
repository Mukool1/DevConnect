import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";

const uploadRouter = express.Router();

uploadRouter.post("/", protect, upload.single("image"), uploadImage);

export default uploadRouter;
