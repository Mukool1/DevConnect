import express from "express";
import * as searchController from "../controllers/searchController.js";
import protect from "../middlewares/authMiddleware.js";

const searchRouter = express.Router();

searchRouter.get("/users", protect, searchController.searchUsers);
searchRouter.get("/posts", protect, searchController.searchPosts);

export default searchRouter;
