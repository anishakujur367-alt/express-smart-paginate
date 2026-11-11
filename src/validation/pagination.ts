import type { PaginationMode } from "../types";
export function validatePage(page: unknown): number {
  const parsedPage = Number(page);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    throw new Error("Page must be a positive integer.");
  }

  return parsedPage;
}



export function validateLimit(
  limit: unknown,
  defaultLimit: number = 10,
  maxLimit: number = 100
): number {
  if (limit === undefined) {
    return defaultLimit;
  }

  const parsedLimit = Number(limit);

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1
  ) {
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

export function validateCursor(cursor: unknown): string | undefined {
  if (cursor === undefined) {
    return undefined;
  }

  if (typeof cursor !== "string" || cursor.trim() === "") {
    throw new Error("Cursor must be a non-empty string.");
  }

  return cursor;
}
