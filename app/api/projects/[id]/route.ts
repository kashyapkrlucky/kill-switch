import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import { Project } from "@/core/models/Project";

const validateUserAndProject = async (id: string) => {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return null;
  }

  await connectToDatabase();
  // find project by id and check if user is a member
  const project = await Project.findOne({ _id: id, members: userId });
  if (!project) {
    return null;
  }
  return { project };
};

export async function GET(
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await validateUserAndProject(id);
    if (!result) {
      return BadRequestResponse("User not found or project not found");
    }
    const { project } = result;

    return SuccessResponse(project);
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
    const result = await validateUserAndProject(id);
    if (!result) {
      return BadRequestResponse("User not found or project not found");
    }
    const { project } = result;
    const body = await req.json();
    const { name, description } = body;
    if (!name || !description) {
      return BadRequestResponse("Name and description are required");
    }
    project.name = name;
    project.description = description;
    await project.save();

    return SuccessResponse(project);
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
    const result = await validateUserAndProject(id);
    if (!result) {
      return BadRequestResponse("User not found or project not found");
    }
    const { project } = result;
    await project.deleteOne();
    return SuccessResponse("Project deleted");
  } catch (error) {
    return ErrorResponse(error);
  }
}
