import { ProjectToken } from "@/core/models/ProjectToken";
import {
  ErrorResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/core/utils/responses";
import { Flag } from "@/core/models/Flag";

// based on token return flags, token will have project id and permissions
export async function GET(request: Request) {
  try {
    // token will be in auth header with Bearer
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // validate token
    const projectToken = await ProjectToken.findOne({ token });
    if (!projectToken) {
      return UnauthorizedResponse(
        "You are not authorized to access this resource"
      );
    }

    if (projectToken && projectToken.expiresAt < new Date()) {
      return UnauthorizedResponse("Token has expired");
    }

    if (!projectToken.project) {
      return UnauthorizedResponse("Token is invalid");
    }
    
    // extract project id and permissions
    const { project } = projectToken;


    const flags = await Flag.find({ project }).select("name code status");
    const flagsData = flags.map((flag) => {
      return {
        code: flag.code,
        name: flag.name,
        status: flag.status,
      };
    });
    projectToken.usage.requests += 1;
    await projectToken.save();
    // return flags
    return SuccessResponse(flagsData);
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
