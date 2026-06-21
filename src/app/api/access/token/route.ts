import { BadRequestResponse, SuccessResponse } from "@/core/utils/responses";
import { signToken } from "@/core/lib/auth";
import { Project } from "@/core/models/Project";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import mongoose from "mongoose";
import { ProjectToken } from "@/core/models/ProjectToken";

// Generate API token using project ID
export async function POST(request: Request) {
  const { projectId } = await request.json();
  if (!projectId) {
    return BadRequestResponse("Project ID is required");
  }

  await connectToDatabase();
  const project = await Project.findById(projectId);
  if (!project) {
    return BadRequestResponse("Project not found");
  }
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return BadRequestResponse("User not found");
  }

  if (
    project.owner.toString() !== userId &&
    !project.members.includes(new mongoose.Types.ObjectId(userId))
  ) {
    return BadRequestResponse(
      "You are not the owner or member of this project"
    );
  }

  const token = await signToken({ sub: projectId });
  const projectToken = await ProjectToken.create({
    project: projectId,
    token,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });
  return SuccessResponse(projectToken);
}

// Return tokens array, expiry date based on project id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return BadRequestResponse("Project ID is required");
  }

  await connectToDatabase();
  const project = await Project.findById(projectId);
  if (!project) {
    return BadRequestResponse("Project not found");
  }
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return BadRequestResponse("User not found");
  }

  if (
    project.owner.toString() !== userId &&
    !project.members.includes(new mongoose.Types.ObjectId(userId))
  ) {
    return BadRequestResponse(
      "You are not the owner or member of this project"
    );
  }

  const projectTokens = await ProjectToken.find({ project: projectId });
  return SuccessResponse(projectTokens);
}
