export function calculateOffset(
  page: number,
  limit: number
): number {
  return (page - 1) * limit;
}



export function paginateOffset<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  const offset = calculateOffset(page, limit);

  const paginatedData = data.slice(offset, offset + limit);

  return {
    data: paginatedData,
    pagination: {
      mode: "offset" as const,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1
    }
  };
}
