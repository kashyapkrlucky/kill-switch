import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import { Flag } from "@/core/models/Flag";
import { Project } from "@/core/models/Project";
import { cache } from "@/core/lib/redis";
import { FLAG_ENVIRONMENTS } from "@/core/types/app.types";
import {
  getDerivedFlagStatus,
  isFlagEnvironment,
  isFlagStatus,
  normalizeFlagEnvironments,
} from "@/core/utils/flag-environments";

const validateUserAndFlag = async (id: string) => {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return null;
  }

  await connectToDatabase();
  // find flag by id and check if user is a member
  const flag = await Flag.findOne({ _id: id });
  if (!flag) {
    return null;
  }
  const project = await Project.findOne({
    _id: flag.project,
    $or: [{ owner: userId }, { members: userId }],
  });
  if (!project) {
    return null;
  }
  return { flag };
};

export async function GET(
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await validateUserAndFlag(id);
    if (!result) {
      return BadRequestResponse("User not found or flag not found");
    }
    const { flag } = result;

    return SuccessResponse(flag);
  } catch (error) {
    return ErrorResponse(error);
  }
}

export async function PATCH(
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await validateUserAndFlag(id);
    if (!result) {
      return BadRequestResponse("User not found or flag not found");
    }
    const { flag } = result;
    const body = await req.json();
    const { name, description, status, environment, environments } = body;

    if (name) flag.name = name;
    if (description) flag.description = description;

    const normalizedEnvironments = normalizeFlagEnvironments(
      flag.environments,
      flag.status
    );

    if (environment || status) {
      if (!isFlagEnvironment(environment)) {
        return BadRequestResponse("Invalid flag environment");
      }
      if (!isFlagStatus(status)) {
        return BadRequestResponse("Invalid flag status");
      }

      normalizedEnvironments[environment] = {
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    if (environments) {
      for (const [key, value] of Object.entries(environments)) {
        if (!isFlagEnvironment(key)) {
          return BadRequestResponse("Invalid flag environment");
        }

        const nextStatus = (value as { status?: unknown }).status;
        if (!isFlagStatus(nextStatus)) {
          return BadRequestResponse("Invalid flag status");
        }

        normalizedEnvironments[key] = {
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    flag.set("environments", normalizedEnvironments);
    flag.status = getDerivedFlagStatus(normalizedEnvironments);
    await flag.save();

    // Invalidate cache for this project
    FLAG_ENVIRONMENTS.forEach(({ key }) => cache.del(`flags:${flag.project}:${key}`));

    return SuccessResponse(flag);
  } catch (error) {
    return ErrorResponse(error);
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await validateUserAndFlag(id);
    if (!result) {
      return BadRequestResponse("User not found or flag not found");
    }
    const { flag } = result;
    const projectId = flag.project;
    await flag.deleteOne();
    
    // Invalidate cache for this project
    FLAG_ENVIRONMENTS.forEach(({ key }) => cache.del(`flags:${projectId}:${key}`));
    
    return SuccessResponse("Flag deleted");
  } catch (error) {
    return ErrorResponse(error);
  }
}
