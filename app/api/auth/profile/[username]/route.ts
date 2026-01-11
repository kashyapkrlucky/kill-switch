import {
  ErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@/core/utils/responses";
import { connectToDatabase } from "@/core/lib/database";
import { Profile } from "@/core/models/Profile";
import { User } from "@/core/models/User"; // Import to ensure User model is registered for population

export async function GET(
  req: Request,
  context:
    | { params: { username: string } }
    | { params: Promise<{ username: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;

    const username = params.username.trim();
    await connectToDatabase();

    // Ensure User model is available for population
    const UserModel = User;
    
    const profile = await Profile.findOne({ username })
      .populate({
        path: "user",
        model: UserModel,
        select: "avatar"
      })
      .lean();
    if (!profile) return NotFoundResponse("Profile not found");
    return SuccessResponse(profile);
  } catch (error) {
    return ErrorResponse(error as string);
  }
}
