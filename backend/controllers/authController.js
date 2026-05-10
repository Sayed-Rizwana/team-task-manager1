import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "A user with this email already exists." });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "member",
  });

  return res.status(201).json({
    message: "User registered successfully.",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.status(200).json({
    message: "Login successful.",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
