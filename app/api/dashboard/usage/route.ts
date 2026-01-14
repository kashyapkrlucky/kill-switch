// api to provide usage for project token - monthly

import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { Project } from "@/core/models/Project";
import { ProjectToken } from "@/core/models/ProjectToken";
import { IDBProject } from "@/core/types/database.types";
import { connectToDatabase } from "@/core/lib/database";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    await connectToDatabase();
    // Get user's project IDs once to reuse
    const userProjectIds = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).distinct("_id");

    // Get all active tokens for user's projects with project details
    const tokens = await ProjectToken.find({
      project: { $in: userProjectIds },
      status: "active",
    }).populate("project", "name");

    // Format per-token usage data with current stats
    const tokenUsage = tokens.map((token) => {
      const project = token.project as unknown as IDBProject;

      return {
        id: token._id,
        projectName: project.name,
        requests: token.usage.requests,
        limit: token.usage.limit,
        remaining: Math.max(0, token.usage.limit - token.usage.requests),
        status: token.status,
        expiresAt: token.expiresAt,
        isNearLimit: token.usage.requests / token.usage.limit > 0.8, // 80% threshold
      };
    });

    return SuccessResponse(tokenUsage);
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
