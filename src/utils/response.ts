
import type { PaginationMetadata } from "../types";

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMetadata;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export function formatSuccessResponse<T>(
  data: T,
  message: string = "Request successful",
  pagination?: PaginationMetadata
): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    ...(pagination && { pagination })
  };
}

export function formatErrorResponse(
  message: string,
  error?: string
): ErrorResponse {
  return {
    success: false,
    message,
    ...(error && { error })
  };
}
