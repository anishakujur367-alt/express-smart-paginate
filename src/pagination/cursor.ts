
export function encodeCursor(value: string | number): string {
  return Buffer.from(String(value)).toString("base64url");
}

export function decodeCursor(cursor: string): string {
  try {
    return Buffer.from(cursor, "base64url").toString("utf-8");
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
  let startIndex = 0;
  let endIndex = limit;

  if (cursor) {
    const decodedCursor = decodeCursor(cursor);

    const cursorIndex = data.findIndex(
      (item) => String(item[cursorField]) === decodedCursor
    );

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
      nextCursor: hasNextPage && lastItem
        ? encodeCursor(String(lastItem[cursorField]))
        : undefined,
      previousCursor: hasPreviousPage && firstItem
        ? encodeCursor(String(firstItem[cursorField]))
        : undefined
    }
  };
}
