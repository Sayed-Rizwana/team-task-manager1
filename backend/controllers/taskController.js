import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateTask = (query) =>
  query
    .populate("project", "title status")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

const hasProjectMembership = (project, userId) =>
  project.members.some((member) => member.user.toString() === userId.toString());

export const getTasks = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id }).select("_id");
  const projectIds = projects.map((project) => project._id);

  const filters = {
    project: { $in: projectIds },
  };

  if (req.query.project) {
    filters.project = req.query.project;
  }

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const tasks = await populateTask(Task.find(filters).sort({ dueDate: 1, createdAt: -1 }));
  res.status(200).json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (!hasProjectMembership(project, req.user._id)) {
    return res.status(403).json({ message: "You are not a member of this project." });
  }

  const assigneeIsMember = project.members.some(
    (member) => member.user.toString() === req.body.assignedTo
  );

  if (!assigneeIsMember) {
    return res.status(400).json({ message: "Assigned user must be a project member." });
  }

  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id,
  });

  const createdTask = await populateTask(Task.findById(task._id));
  res.status(201).json(createdTask);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  const project = await Project.findById(task.project);
  if (!project || !hasProjectMembership(project, req.user._id)) {
    return res.status(403).json({ message: "You are not authorized to update this task." });
  }

  if (req.body.assignedTo) {
    const assigneeIsMember = project.members.some(
      (member) => member.user.toString() === req.body.assignedTo
    );
    if (!assigneeIsMember) {
      return res.status(400).json({ message: "Assigned user must be a project member." });
    }
  }

  Object.assign(task, req.body);
  await task.save();

  const updatedTask = await populateTask(Task.findById(task._id));
  res.status(200).json(updatedTask);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  const project = await Project.findById(task.project);
  if (!project || !hasProjectMembership(project, req.user._id)) {
    return res.status(403).json({ message: "You are not authorized to delete this task." });
  }

  await task.deleteOne();
  res.status(200).json({ message: "Task deleted successfully." });
});
