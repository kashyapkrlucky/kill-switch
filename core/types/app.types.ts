/**
 * Represents a user in the system
 */
export interface IUser {
  /** Unique identifier for the user */
  _id: string;
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
  /** When the reply was created */
  createdAt?: string;
  /** When the reply was last updated */
  updatedAt?: string;
}
