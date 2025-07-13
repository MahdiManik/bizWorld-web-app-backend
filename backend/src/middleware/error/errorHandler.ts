/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import {
  ApiErrorResponse,
  ErrorCode,
  HttpStatus,
} from "../../shared-types/type";

// Type guard to check if a value is a valid ErrorCode
const isErrorCode = (code: any): code is ErrorCode => {
  return Object.values(ErrorCode).includes(code);
};

// Helper function to safely get an error code
const getErrorCode = (code: any): ErrorCode => {
  return isErrorCode(code) ? code : ErrorCode.INTERNAL_ERROR;
};

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    code: string = ErrorCode.INTERNAL_ERROR,
    details?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response
): void => {
  const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";
  const code = getErrorCode(error.code);

  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });

  const errorResponse: ApiErrorResponse = {
    code,
    message,
    details: error.details,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json({
    error: errorResponse,
  });
};
