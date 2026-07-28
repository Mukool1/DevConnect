import { body } from "express-validator";

export const createPostValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ max: 2000 })
    .withMessage("Post can't exceed 2000 characters"),
];

export const commentValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ max: 500 })
    .withMessage("Comment can't exceed 500 characters"),
];
