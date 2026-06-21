import { Model } from "mongoose";
import { IDBFlag } from "@/core/types/database.types";
import mongoose, { Schema, models } from "mongoose";

const EnvironmentStateSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

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
    environments: {
      development: {
        type: EnvironmentStateSchema,
        default: () => ({ status: "active", updatedAt: new Date() }),
      },
      staging: {
        type: EnvironmentStateSchema,
        default: () => ({ status: "inactive", updatedAt: new Date() }),
      },
      production: {
        type: EnvironmentStateSchema,
        default: () => ({ status: "inactive", updatedAt: new Date() }),
      },
    },
  },
  {
    timestamps: true,
  }
);

FlagSchema.index({ project: 1 });
FlagSchema.index({ project: 1, code: 1 }, { unique: true });

FlagSchema.pre("validate", function normalizeEnvironmentState() {
  const now = new Date();

  this.environments = {
    development: {
      status: this.environments?.development?.status || this.status || "active",
      updatedAt: this.environments?.development?.updatedAt || now,
    },
    staging: {
      status: this.environments?.staging?.status || "inactive",
      updatedAt: this.environments?.staging?.updatedAt || now,
    },
    production: {
      status: this.environments?.production?.status || "inactive",
      updatedAt: this.environments?.production?.updatedAt || now,
    },
  };

  this.status =
    this.environments.production.status === "active" ? "active" : "inactive";

});

/**
 * Mongoose model for the Flag collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const Flag: Model<IDBFlag> =
  models.Flag || mongoose.model<IDBFlag>("Flag", FlagSchema);
