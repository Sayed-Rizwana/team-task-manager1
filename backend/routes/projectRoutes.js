import express from "express";
import { body } from "express-validator";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(
    [
      body("title").trim().notEmpty().withMessage("Project title is required."),
      body("description").optional().isString(),
      body("status").optional().isIn(["Planning", "Active", "Completed", "Archived"]),
      body("members").optional().isArray().withMessage("Members must be an array."),
    ],
    validateRequest,
    createProject
  );

router
  .route("/:id")
  .get(getProjectById)
  .put(
    [
      body("title").optional().trim().notEmpty().withMessage("Project title cannot be empty."),
      body("status").optional().isIn(["Planning", "Active", "Completed", "Archived"]),
      body("members").optional().isArray().withMessage("Members must be an array."),
    ],
    validateRequest,
    updateProject
  )
  .delete(deleteProject);

export default router;
