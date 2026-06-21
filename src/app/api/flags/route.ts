import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import { Flag } from "@/core/models/Flag";
import { Project } from "@/core/models/Project";
import { generateFlagCode } from "@/core/utils/helpers";
import { cache } from "@/core/lib/redis";
import {
  DEFAULT_FLAG_ENVIRONMENTS,
  getDerivedFlagStatus,
  normalizeFlagEnvironments,
} from "@/core/utils/flag-environments";
import { FLAG_ENVIRONMENTS } from "@/core/types/app.types";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return BadRequestResponse("User not found");
    }
    await connectToDatabase();

    const userProjectIds = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).distinct("_id");

    const flags = await Flag.find({
      project: { $in: userProjectIds },
    }).sort({ createdAt: -1 }).populate("project", "name");
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

    const { name, description, project, environments } = await request.json();
    const projectDoc = await Project.findOne({
      _id: project,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!projectDoc) {
      return BadRequestResponse("Project not found");
    }

    const flags = await Flag.countDocuments({ project: projectDoc._id });
    const code = generateFlagCode(projectDoc?.code, flags);
    const normalizedEnvironments = normalizeFlagEnvironments(
      environments || DEFAULT_FLAG_ENVIRONMENTS
    );
    const flag = new Flag({
      name,
      code,
      description,
      project,
      environments: normalizedEnvironments,
      status: getDerivedFlagStatus(normalizedEnvironments),
    });

    const savedFlag = await flag.save();
    
    // Invalidate cache for this project
    FLAG_ENVIRONMENTS.forEach(({ key }) => cache.del(`flags:${project}:${key}`));
    
    // Populate project field before returning
    const populatedFlag = await Flag.findById(savedFlag._id).populate('project', 'name code');
    
    return SuccessResponse(populatedFlag);
  } catch (error) {
    return ErrorResponse(error);
  }
}
