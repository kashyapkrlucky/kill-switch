import {
  FlagEnvironment,
  FlagEnvironmentState,
  FlagEnvironmentType,
  FlagStatus,
  FlagStatusType,
} from "@/core/types/app.types";

export const DEFAULT_FLAG_ENVIRONMENTS: FlagEnvironmentState = {
  [FlagEnvironment.DEVELOPMENT]: {
    status: FlagStatus.ACTIVE,
  },
  [FlagEnvironment.STAGING]: {
    status: FlagStatus.INACTIVE,
  },
  [FlagEnvironment.PRODUCTION]: {
    status: FlagStatus.INACTIVE,
  },
};

export const isFlagEnvironment = (
  value: unknown
): value is FlagEnvironmentType =>
  typeof value === "string" &&
  Object.values(FlagEnvironment).includes(value as FlagEnvironmentType);

export const isFlagStatus = (value: unknown): value is FlagStatusType =>
  typeof value === "string" &&
  Object.values(FlagStatus).includes(value as FlagStatusType);

export const normalizeFlagEnvironments = (
  environments?: Partial<
    Record<
      FlagEnvironmentType,
      {
        status?: FlagStatusType;
        updatedAt?: string | Date;
      }
    >
  >,
  fallbackStatus: FlagStatusType = FlagStatus.ACTIVE
): FlagEnvironmentState => {
  const now = new Date().toISOString();

  return {
    [FlagEnvironment.DEVELOPMENT]: {
      status:
        environments?.development?.status || fallbackStatus || FlagStatus.ACTIVE,
      updatedAt: environments?.development?.updatedAt?.toString() || now,
    },
    [FlagEnvironment.STAGING]: {
      status: environments?.staging?.status || FlagStatus.INACTIVE,
      updatedAt: environments?.staging?.updatedAt?.toString() || now,
    },
    [FlagEnvironment.PRODUCTION]: {
      status: environments?.production?.status || FlagStatus.INACTIVE,
      updatedAt: environments?.production?.updatedAt?.toString() || now,
    },
  };
};

export const getDerivedFlagStatus = (
  environments: FlagEnvironmentState
): FlagStatusType => environments.production.status;
