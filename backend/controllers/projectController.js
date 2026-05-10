import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateProject = (query) =>
  query.populate("createdBy", "name email role").populate("members.user", "name email role");

const normalizeMembers = async (members = [], creatorId) => {
  const seen = new Map();
  const memberIds = [];

  for (const member of members) {
    if (!mongoose.Types.ObjectId.isValid(member.user)) {
      continue;
    }

    const userId = member.user.toString();
    if (!seen.has(userId)) {
      seen.set(userId, {
        user: userId,
        role: member.role === "admin" ? "admin" : "member",
      });
      memberIds.push(userId);
    }
  }

  const creatorKey = creatorId.toString();
  if (!seen.has(creatorKey)) {
    seen.set(creatorKey, { user: creatorKey, role: "admin" });
    memberIds.push(creatorKey);
  }

  const existingUsers = await User.find({ _id: { $in: memberIds } }).select("_id");
  const validIds = new Set(existingUsers.map((user) => user._id.toString()));

  return Array.from(seen.values()).filter((member) => validIds.has(member.user));
};

const ensureProjectAccess = (project, userId) =>
  project.members.some((member) => member.user._id.toString() === userId.toString());

const ensureProjectAdmin = (project, userId) =>
  project.members.some(
    (member) => member.user._id.toString() === userId.toString() && member.role === "admin"
  );

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await populateProject(
    Project.find({
      "members.user": req.user._id,
    }).sort({ updatedAt: -1 })
  );

  res.status(200).json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const members = await normalizeMembers(req.body.members, req.user._id);

  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user._id,
    members,
    status: req.body.status || "Active",
  });

  const createdProject = await populateProject(Project.findById(project._id));
  res.status(201).json(createdProject);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await populateProject(Project.findById(req.params.id));

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (!ensureProjectAccess(project, req.user._id)) {
    return res.status(403).json({ message: "You are not a member of this project." });
  }

  const tasks = await Task.find({ project: project._id })
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });

  res.status(200).json({ ...project.toObject(), tasks });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await populateProject(Project.findById(req.params.id));

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (!ensureProjectAdmin(project, req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only project admins can update this project." });
  }

  project.title = req.body.title ?? project.title;
  project.description = req.body.description ?? project.description;
  project.status = req.body.status ?? project.status;

  if (req.body.members) {
    project.members = await normalizeMembers(req.body.members, project.createdBy._id);
  }

  await project.save();
  const updatedProject = await populateProject(Project.findById(project._id));

  res.status(200).json(updatedProject);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await populateProject(Project.findById(req.params.id));

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  if (!ensureProjectAdmin(project, req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only project admins can delete this project." });
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.status(200).json({ message: "Project deleted successfully." });
});
