import mongoose, { Schema, models, Model } from "mongoose";
import { IDBProject } from "@/core/types/database.types";

const ProjectSchema = new Schema<IDBProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project owner is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for the Project collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const Project: Model<IDBProject> =
  models.Project || mongoose.model<IDBProject>("Project", ProjectSchema);
