/* eslint-disable @typescript-eslint/no-explicit-any */
// shared-types.ts

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  OTP_EXPIRED = "OTP_EXPIRED",
  OTP_MISMATCH = "OTP_MISMATCH",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
}

export interface ApiErrorResponse {
  code: ErrorCode;
  message: string;
  details?: any;
  timestamp: string;
}
