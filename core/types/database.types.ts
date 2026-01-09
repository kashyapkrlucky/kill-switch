import { Types, Document } from "mongoose";

/**
 * Represents a user in the system
 */
export interface IDBUser extends Document {
  /** Unique identifier for the user */
  _id: Types.ObjectId;
  /** User's full name */
  username: string;
  /** User's email address (must be unique) */
  email: string;
  /** Password (not returned in API responses) */
  password?: string;
  /** Short biography or description */
  bio?: string;
  /** User's avatar image URL */
  avatar?: string;
}
