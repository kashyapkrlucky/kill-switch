import { Model } from "mongoose";
import { IDBFlag } from "@/core/types/database.types";
import mongoose, { Schema, models } from "mongoose";

const FlagSchema = new Schema<IDBFlag>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    name: {
      type: String,
      required: [true, "Flag name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Flag code is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

FlagSchema.index({ project: 1 });

/**
 * Mongoose model for the Flag collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const Flag: Model<IDBFlag> =
  models.Flag || mongoose.model<IDBFlag>("Flag", FlagSchema);
