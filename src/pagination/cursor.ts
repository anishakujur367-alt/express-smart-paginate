
export function encodeCursor(value: string | number): string {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    String(value).trim() === "" ||
    (typeof value === "number" && !Number.isFinite(value))
  ) {
    throw new Error("Cursor value must be a valid string or number.");
  }

  return Buffer.from(String(value)).toString("base64url");
}

export function decodeCursor(cursor: string): string {
  if (typeof cursor !== "string" || cursor.trim() === "") {
    throw new Error("Invalid cursor.");
  }

  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf-8");

    // Check that the cursor is valid base64url.
    if (
      Buffer.from(decoded).toString("base64url") !== cursor ||
      decoded.trim() === ""
    ) {
      throw new Error("Invalid cursor.");
    }

    return decoded;
  } catch {
    throw new Error("Invalid cursor.");
  }
}

export function paginateCursor<T extends Record<string, unknown>>(
  data: T[],
  limit: number,
  cursor?: string,
  cursorField: keyof T = "id" as keyof T,
  direction: "next" | "previous" = "next"
) {
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array.");
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Limit must be a positive integer.");
  }

  if (direction !== "next" && direction !== "previous") {
    throw new Error("Direction must be next or previous.");
  }

  if (cursor !== undefined && cursor === "") {
    throw new Error("Invalid cursor.");
  }

  const cursorValues = data.map((item) => {
    const value = item[cursorField];

    if (
      (typeof value !== "string" && typeof value !== "number") ||
      String(value).trim() === "" ||
      (typeof value === "number" && !Number.isFinite(value))
    ) {
      throw new Error("Every record must have a valid cursor field.");
    }

    return String(value);
  });

  if (new Set(cursorValues).size !== cursorValues.length) {
    throw new Error("Cursor field values must be unique.");
  }

  let startIndex = 0;
  let endIndex = limit;

  if (cursor !== undefined) {
    const decodedCursor = decodeCursor(cursor);

    const cursorIndex = cursorValues.indexOf(decodedCursor);

    if (cursorIndex === -1) {
      throw new Error("Cursor not found.");
    }

    if (direction === "next") {
      startIndex = cursorIndex + 1;
      endIndex = startIndex + limit;
    } else {
      endIndex = cursorIndex;
      startIndex = Math.max(0, endIndex - limit);
    }
  }

  const paginatedData = data.slice(startIndex, endIndex);

  const firstItem = paginatedData[0];
  const lastItem = paginatedData[paginatedData.length - 1];

  const hasPreviousPage = startIndex > 0;
  const hasNextPage = endIndex < data.length;

  return {
    data: paginatedData,
    pagination: {
      mode: "cursor" as const,
      limit,
      hasNextPage,
      hasPreviousPage,
      nextCursor:
        hasNextPage && lastItem
          ? encodeCursor(String(lastItem[cursorField]))
          : undefined,
      previousCursor:
        hasPreviousPage && firstItem
          ? encodeCursor(String(firstItem[cursorField]))
          : undefined
    }
  };
}
