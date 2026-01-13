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

export interface IProfile {
  /** Unique identifier for the profile */
  _id: string;
  user: IUser;
  name: string;
  username: string;
  country?: string;
  /** When the reply was created */
  createdAt: string;
  /** When the reply was last updated */
  updatedAt: string;
}

export interface IProject {
  /** Unique identifier for the project */
  _id: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** Project status */
  status: "active" | "inactive" | "completed";
  /** Project owner */
  owner: string;
  /** Project members */
  members: string[];
  /** Project flags */
  flags: number;
  /** Project created at */
  createdAt?: string;
  /** Project updated at */
  updatedAt?: string;
}

export interface IFlag {
  /** Unique identifier for the flag */
  _id: string;
  /** Flag project */
  project: string;
  /** Flag name */
  name: string;
  /** Flag description */
  description?: string;
  /** Flag status */
  status: FlagStatusType;
  /** Flag created at */
  createdAt?: string;
  /** Flag updated at */
  updatedAt?: string;
}

export const FlagStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FlagStatusType = (typeof FlagStatus)[keyof typeof FlagStatus];


export interface IProjectToken {
  /** Unique identifier for the project token */
  _id: string;
  /** Project token project */
  project: string;
  /** Project token */
  token: string;
  /** Project token expiration */
  expiresAt?: string;
  /** Project token status */
  status: "active" | "inactive";
  usage: {
    requests: number;
    limit: number;
  };
  /** Project token created at */
  createdAt?: string;
  /** Project token updated at */
  updatedAt?: string;
}
