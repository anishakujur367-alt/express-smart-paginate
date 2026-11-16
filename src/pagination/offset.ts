
export function calculateOffset(
  page: number,
  limit: number
): number {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer.");
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Limit must be a positive integer.");
  }

  return (page - 1) * limit;
}

export function paginateOffset<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array.");
  }

  if (!Number.isInteger(total) || total < 0) {
    throw new Error("Total must be a non-negative integer.");
  }

  const offset = calculateOffset(page, limit);

  const paginatedData = data.slice(offset, offset + limit);

  const totalPages = Math.ceil(total / limit);

  return {
    data: paginatedData,
    pagination: {
      mode: "offset" as const,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && page <= totalPages
    }
  };
}
