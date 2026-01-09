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
  /** User created at */
  createdAt?: Date;
  /** User updated at */
  updatedAt?: Date;
}

export interface IDBProject extends Document {
  /** Unique identifier for the project */
  _id: Types.ObjectId;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** Project status */
  status: 'active' | 'inactive' | 'completed';
  /** Project owner */
  owner: Types.ObjectId;
  /** Project members */
  members: Types.ObjectId[];
  /** Project created at */
  createdAt?: Date;
  /** Project updated at */
  updatedAt?: Date;
}

export interface IDBFlag extends Document {
  /** Unique identifier for the flag */
  _id: Types.ObjectId;
  /** Flag project */
  project: Types.ObjectId;
  /** Flag name */
  name: string;
  /** Flag description */
  description?: string;
  /** Flag status */
  status: 'active' | 'inactive';
  /** Flag created at */
  createdAt?: Date;
  /** Flag updated at */
  updatedAt?: Date;
}