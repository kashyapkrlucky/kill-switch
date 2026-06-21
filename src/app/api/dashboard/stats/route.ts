import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { Project } from "@/core/models/Project";
import { Flag } from "@/core/models/Flag";
import { ProjectToken } from "@/core/models/ProjectToken";
import { connectToDatabase } from "@/core/lib/database";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    await connectToDatabase();
    
    // Get user's projects once and reuse the data
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).select("_id").lean();
    
    const userProjectIds = userProjects.map(p => p._id);
    const projects = userProjects.length;

    // Use aggregation pipeline to get all flag stats in one query
    const flagStats = await Flag.aggregate([
      { $match: { project: { $in: userProjectIds } } },
      {
        $group: {
          _id: null,
          totalFlags: { $sum: 1 },
          activeFlags: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          }
        }
      }
    ]);

    // Get API tokens count
    const [apiTokens] = await ProjectToken.aggregate([
      { $match: { project: { $in: userProjectIds } } },
      { $count: "apiTokens" }
    ]);

    const stats = flagStats[0] || { totalFlags: 0, activeFlags: 0 };
    
    return SuccessResponse({
      projects,
      activeFlags: stats.activeFlags,
      apiTokens: apiTokens?.apiTokens || 0,
      totalFlags: stats.totalFlags,
    });
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
