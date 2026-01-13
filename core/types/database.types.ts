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

  /** Password reset token and expiration */
  passwordReset?: {
    token?: string;
    expiresAt?: Date;
    usedAt?: Date;
  };
  /** Creates a password reset token and returns the raw token */
  createPasswordResetToken(): string;
  /** Compares a candidate password with the stored hash */
  comparePassword(candidatePassword: string): Promise<boolean>;
  
  /** User created at */
  createdAt?: Date;
  /** User updated at */
  updatedAt?: Date;
}


export interface IDBProfile extends Document {
  user: Types.ObjectId;
  username: string;
  name?: string;
  bio?: string;
  dob?: Date;
  phone?: string;
  city?: string;
  country?: string;
  isPublic?: boolean;
  cover?: string;
  urlWebsite?: string;
  urlLinkedIn?: string;
  urlTwitter?: string;
  urlGithub?: string;
  urlInstagram?: string;
  urlDribbble?: string;
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

export interface IDBProjectToken extends Document {
  /** Unique identifier for the project token */
  _id: Types.ObjectId;
  /** Project token project */
  project: Types.ObjectId;
  /** Project token */
  token: string;
  /** Project token expiration */
  expiresAt: Date;
  /** Project token status */
  status: 'active' | 'inactive';
  /** Project token usage */
  usage: {
    requests: number;
    limit: number;
  };
  /** Project token created at */
  createdAt?: Date;
  /** Project token updated at */
  updatedAt?: Date;
}

