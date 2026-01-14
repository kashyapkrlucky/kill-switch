import { BadRequestResponse, ErrorResponse } from "@/core/utils/responses";
import { Project } from "@/core/models/Project";
import { SuccessResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import mongoose from "mongoose";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    await connectToDatabase();
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    });
    return SuccessResponse(projects);
  } catch (error) {
    return ErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    await connectToDatabase();

    const body = await request.json();
    const project = new Project({
      name: body.name,
      code: body.name.substring(0, 3).toUpperCase(),
      description: body.description,
      owner: new mongoose.Types.ObjectId(userId),
      members: [new mongoose.Types.ObjectId(userId)],
    });

    await project.save();
    return SuccessResponse(project);
  } catch (error) {
    return ErrorResponse(error);
  }
}
