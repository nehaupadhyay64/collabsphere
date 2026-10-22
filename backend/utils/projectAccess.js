import mongoose from "mongoose";
import Project from "../models/Project.js";

// Sirf owner ya member hi project dekh sakta hai
const getProjectForUser = async (projectId, userId) => {
  if (!mongoose.isValidObjectId(projectId)) return null;

  const project = await Project.findById(projectId)
    .populate("owner", "name email")
    .populate("members", "name email");
  if (!project) return null;

  const isOwner = project.owner._id.equals(userId);
  const isMember = project.members.some((m) => m._id.equals(userId));
  return isOwner || isMember ? project : null;
};

export default getProjectForUser;