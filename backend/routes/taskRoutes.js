import express from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getTasks)
  .post(
    [
      body("title").trim().notEmpty().withMessage("Task title is required."),
      body("project").notEmpty().withMessage("Project is required."),
      body("assignedTo").notEmpty().withMessage("Assigned user is required."),
      body("status").optional().isIn(["Todo", "In Progress", "Completed"]),
      body("priority").optional().isIn(["Low", "Medium", "High"]),
      body("dueDate").isISO8601().withMessage("A valid due date is required."),
    ],
    validateRequest,
    createTask
  );

router
  .route("/:id")
  .put(
    [
      body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty."),
      body("status").optional().isIn(["Todo", "In Progress", "Completed"]),
      body("priority").optional().isIn(["Low", "Medium", "High"]),
      body("dueDate").optional().isISO8601().withMessage("Due date must be valid."),
    ],
    validateRequest,
    updateTask
  )
  .delete(deleteTask);

export default router;
