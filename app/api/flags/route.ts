import { BadRequestResponse, ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import mongoose from "mongoose";
import { Flag } from "@/core/models/Flag";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get("project");

    await connectToDatabase();
    const flags = await Flag.find({
      project: new mongoose.Types.ObjectId(projectId!),
    });
    return SuccessResponse(flags);
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
    const flag = new Flag({
      name: body.name || "New Flag",
      description: body.description || "",
      project: body.project,
    });

    await flag.save();
    return SuccessResponse(flag);
  } catch (error) {
    return ErrorResponse(error);
  }
}
