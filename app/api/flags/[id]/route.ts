import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/core/lib/auth";
import { connectToDatabase } from "@/core/lib/database";
import { Flag } from "@/core/models/Flag";

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
    const { name, description, status } = body;

    if (name) flag.name = name;
    if (description) flag.description = description;
    if (status) flag.status = status;
    await flag.save();

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
    await flag.deleteOne();
    return SuccessResponse("Flag deleted");
  } catch (error) {
    return ErrorResponse(error);
  }
}
