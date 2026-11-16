
import type { PaginationMode } from "../types";

export function validatePage(page: unknown): number {
  if (
    page === "" ||
    (typeof page === "string" && page.trim() === "") ||
    page === undefined ||
    page === null
  ) {
    throw new Error("Page must be a positive integer.");
  }

  const parsedPage = Number(page);

  if (!Number.isSafeInteger(parsedPage) || parsedPage < 1) {
    throw new Error("Page must be a positive integer.");
  }

  return parsedPage;
}

export function validateLimit(
  limit: unknown,
  defaultLimit: number = 10,
  maxLimit: number = 100
): number {
  if (
    !Number.isSafeInteger(defaultLimit) ||
    defaultLimit < 1
  ) {
    throw new Error("Default limit must be a positive integer.");
  }

  if (
    !Number.isSafeInteger(maxLimit) ||
    maxLimit < 1
  ) {
    throw new Error("Maximum limit must be a positive integer.");
  }

  if (defaultLimit > maxLimit) {
    throw new Error("Default limit cannot exceed maximum limit.");
  }

  if (limit === undefined) {
    return defaultLimit;
  }

  if (
    limit === null ||
    limit === "" ||
    (typeof limit === "string" && limit.trim() === "")
  ) {
    throw new Error("Limit must be a positive integer.");
  }

  const parsedLimit = Number(limit);

  if (!Number.isSafeInteger(parsedLimit) || parsedLimit < 1) {
    throw new Error("Limit must be a positive integer.");
  }

  if (parsedLimit > maxLimit) {
    throw new Error(`Limit cannot exceed ${maxLimit}.`);
  }

  return parsedLimit;
}

export function validatePaginationMode(
  mode: unknown = "offset"
): PaginationMode {
  if (mode !== "offset" && mode !== "cursor") {
    throw new Error("Mode must be either offset or cursor.");
  }

  return mode;
}

export function validateCursor(
  cursor: unknown
): string | undefined {
  if (cursor === undefined) {
    return undefined;
  }

  if (typeof cursor !== "string" || cursor.trim() === "") {
    throw new Error("Cursor must be a non-empty string.");
  }

  return cursor;
}
