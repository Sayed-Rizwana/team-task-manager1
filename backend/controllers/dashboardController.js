import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id })
    .populate("members.user", "name email role")
    .sort({ updatedAt: -1 });
  const projectIds = projects.map((project) => project._id);

  const tasks = await Task.find({ project: { $in: projectIds } })
    .populate("project", "title")
    .populate("assignedTo", "name email")
    .sort({ updatedAt: -1 });

  const now = new Date();
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status !== "Completed").length;
  const overdueTasks = tasks.filter(
    (task) => task.status !== "Completed" && new Date(task.dueDate) < now
  ).length;

  const recentActivity = tasks.slice(0, 6).map((task) => ({
    id: task._id,
    title: task.title,
    status: task.status,
    updatedAt: task.updatedAt,
    projectTitle: task.project?.title || "Unknown project",
    assignedTo: task.assignedTo?.name || "Unassigned",
  }));

  const tasksByStatus = [
    { name: "Todo", value: tasks.filter((task) => task.status === "Todo").length },
    {
      name: "In Progress",
      value: tasks.filter((task) => task.status === "In Progress").length,
    },
    { name: "Completed", value: completedTasks },
  ];

  const tasksByPriority = [
    { name: "Low", value: tasks.filter((task) => task.priority === "Low").length },
    { name: "Medium", value: tasks.filter((task) => task.priority === "Medium").length },
    { name: "High", value: tasks.filter((task) => task.priority === "High").length },
  ];

  res.status(200).json({
    summary: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      overdueTasks,
    },
    charts: {
      tasksByStatus,
      tasksByPriority,
    },
    recentActivity,
    projects: projects.slice(0, 5),
  });
});
