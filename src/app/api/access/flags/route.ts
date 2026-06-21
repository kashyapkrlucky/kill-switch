import { ProjectToken } from "@/core/models/ProjectToken";
import {
  ErrorResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/core/utils/responses";
import { Flag } from "@/core/models/Flag";
import { connectToDatabase } from "@/core/lib/database";
import { cache } from "@/core/lib/redis";
import { FlagEnvironment } from "@/core/types/app.types";
import { isFlagEnvironment } from "@/core/utils/flag-environments";
// based on token return flags, token will have project id and permissions
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestedEnvironment =
      url.searchParams.get("environment") || FlagEnvironment.PRODUCTION;

    if (!isFlagEnvironment(requestedEnvironment)) {
      return UnauthorizedResponse("Environment is invalid");
    }

    // token will be in auth header with Bearer
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    await connectToDatabase();
    
    // validate token with lean query for better performance
    const projectToken = await ProjectToken.findOne({ token })
      .select("project expiresAt usage")
      .lean();
    
    if (!projectToken) {
      return UnauthorizedResponse(
        "You are not authorized to access this resource"
      );
    }

    if (projectToken.expiresAt < new Date()) {
      return UnauthorizedResponse("Token has expired");
    }

    if (!projectToken.project) {
      return UnauthorizedResponse("Token is invalid");
    }

    // extract project id and permissions
    const { project } = projectToken;

    // Check cache first
    const cacheKey = `flags:${project}:${requestedEnvironment}`;
    let flags = cache.get(cacheKey);
    
    if (!flags) {
      // Get flags with lean query and projection
      flags = await Flag.find({ project })
        .select("name code status environments")
        .lean()
        .then((projectFlags) =>
          projectFlags.map((flag) => ({
            _id: flag._id,
            name: flag.name,
            code: flag.code,
            status:
              flag.environments?.[requestedEnvironment]?.status || flag.status,
            environment: requestedEnvironment,
          }))
        );
      
      // Cache for 2 minutes
      cache.set(cacheKey, flags, 2 * 60 * 1000);
    }
    
    // Update usage count in background
    ProjectToken.updateOne(
      { token }, 
      { $inc: { "usage.requests": 1 } }
    ).exec();

    // return flags
    return SuccessResponse(flags);
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
