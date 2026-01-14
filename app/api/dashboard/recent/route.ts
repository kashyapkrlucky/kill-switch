import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { Project } from "@/core/models/Project";
import { getUserIdFromCookie } from "@/core/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return ErrorResponse(new Error("User not found"));
    }

    const flags = await Project.aggregate([
      {
        $match: {
          $or: [
            { owner: new mongoose.Types.ObjectId(userId) },
            { members: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "flags",
          localField: "_id",
          foreignField: "project",
          as: "flags",
        },
      },
      {
        $unwind: "$flags",
      },
      {
        $sort: { "flags.updatedAt": -1 },
      },
      {
        $replaceRoot: { newRoot: "$flags" },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectInfo",
        },
      },
      {
        $unwind: "$projectInfo",
      },
      {
        $project: {
          name: 1,
          code:1,
          description: 1,
          status: 1,
          createdAt: 1,
          project: "$projectInfo.name",
        },
      },
      {
        $limit: 20,
      },
    ]);

    return SuccessResponse(flags);
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
