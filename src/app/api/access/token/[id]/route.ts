import { BadRequestResponse, SuccessResponse } from "@/core/utils/responses";
import { ProjectToken } from "@/core/models/ProjectToken";
import { connectToDatabase } from "@/core/lib/database";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { Project } from "@/core/models/Project";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!id) {
    return BadRequestResponse("Token ID is required");
  }
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return BadRequestResponse("User not found");
  }
  await connectToDatabase();

  const token = await ProjectToken.findById(id);
  if (!token) {
    return BadRequestResponse("Token not found");
  }

  const project = await Project.findById(token.project);
  if (!project) {
    return BadRequestResponse("Project not found");
  }

  if (
    project.owner.toString() !== userId &&
    !project.members.includes(new mongoose.Types.ObjectId(userId))
  ) {
    return BadRequestResponse("You are not the owner or member of this project");
  }

  await ProjectToken.deleteOne({ _id: id });
  return SuccessResponse("Token deleted successfully");
}
