import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { Project } from "@/core/models/Project";
import { Flag } from "@/core/models/Flag";
import { ProjectToken } from "@/core/models/ProjectToken";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }

    const projects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
    });
    // Get user's project IDs once to reuse
    const userProjectIds = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).distinct("_id");

    // 2. for total flags
    const totalFlags = await Flag.countDocuments({
      project: { $in: userProjectIds }
    });

    // 3. for api tokens
    const apiTokens = await ProjectToken.countDocuments({
      project: { $in: userProjectIds }
    });

    // 4. for active flags
    const activeFlags = await Flag.countDocuments({
      status: "active",
      project: { $in: userProjectIds }
    });

    return SuccessResponse({
      projects,
      activeFlags,
      apiTokens,
      totalFlags,
    });
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
