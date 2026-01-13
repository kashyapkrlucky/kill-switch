import mongoose, { Schema, models, Model } from "mongoose";
import { IDBProjectToken } from "@/core/types/database.types";

const ProjectTokenSchema = new Schema<IDBProjectToken>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    token: {
      type: String,
      required: [true, "Project token is required"],
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: [true, "Project token expiration is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    usage: {
      requests: {
        type: Number,
        default: 0,
      },
      limit: {
        type: Number,
        default: 5000,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for the Project collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const ProjectToken: Model<IDBProjectToken> =
  models.ProjectToken ||
  mongoose.model<IDBProjectToken>("ProjectToken", ProjectTokenSchema);
