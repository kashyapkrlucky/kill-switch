// api to provide usage for project token - monthly

import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { Project } from "@/core/models/Project";
import { ProjectToken } from "@/core/models/ProjectToken";
import { connectToDatabase } from "@/core/lib/database";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    await connectToDatabase();
    
    // Use aggregation to get tokens with project names in one query
    const tokens = await ProjectToken.aggregate([
      {
        $match: {
          project: {
            $in: await Project.find({
              $or: [{ owner: userId }, { members: userId }],
            }).select("_id").lean().then(projects => projects.map(p => p._id))
          },
          status: "active"
        }
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectDoc",
          pipeline: [
            { $project: { name: 1 } }
          ]
        }
      },
      { $unwind: "$projectDoc" },
      {
        $project: {
          _id: 1,
          projectName: "$projectDoc.name",
          "usage.requests": 1,
          "usage.limit": 1,
          status: 1,
          expiresAt: 1
        }
      }
    ]);

    // Format per-token usage data with current stats
    const tokenUsage = tokens.map((token) => {
      const requests = token.usage.requests;
      const limit = token.usage.limit;
      
      return {
        id: token._id,
        projectName: token.projectName,
        requests,
        limit,
        remaining: Math.max(0, limit - requests),
        status: token.status,
        expiresAt: token.expiresAt,
        isNearLimit: requests / limit > 0.8, // 80% threshold
      };
    });

    return SuccessResponse(tokenUsage);
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
