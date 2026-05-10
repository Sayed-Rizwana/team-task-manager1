import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../db.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([Task.deleteMany({}), Project.deleteMany({}), User.deleteMany({})]);

  const password = await bcrypt.hash("Password123!", 10);

  const [admin, member] = await User.create([
    {
      name: "Ava Johnson",
      email: "ava@teamtaskmanager.dev",
      password,
      role: "admin",
    },
    {
      name: "Noah Patel",
      email: "noah@teamtaskmanager.dev",
      password,
      role: "member",
    },
  ]);

  const project = await Project.create({
    title: "Product Launch Sprint",
    description: "Coordinate design, engineering, and QA tasks for the next product release.",
    createdBy: admin._id,
    members: [
      { user: admin._id, role: "admin" },
      { user: member._id, role: "member" },
    ],
    status: "Active",
  });

  await Task.create([
    {
      title: "Finalize onboarding flow",
      description: "Ship the updated product onboarding experience with analytics events.",
      project: project._id,
      assignedTo: member._id,
      status: "In Progress",
      priority: "High",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    },
    {
      title: "QA release checklist",
      description: "Validate critical flows and prepare sign-off notes for launch.",
      project: project._id,
      assignedTo: admin._id,
      status: "Todo",
      priority: "Medium",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
    },
  ]);

  console.log("Sample data seeded.");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
