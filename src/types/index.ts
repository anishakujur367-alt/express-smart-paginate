
export type PaginationMode = "offset" | "cursor";

export type SortDirection = "asc" | "desc";

export type FilterValueType = "string" | "number" | "boolean";

export type FilterValue = string | number | boolean;

export interface FilterDefinition {
  type: FilterValueType;
  allowedValues?: readonly FilterValue[];
}

export interface SmartPaginateOptions {
  mode?: PaginationMode;
  defaultLimit?: number;
  maxLimit?: number;
  allowedSortFields?: readonly string[];
  allowedFilters?: Readonly<Record<string, FilterDefinition>>;
}

export interface PaginationMetadata {
  mode: PaginationMode;
  limit: number;
  total?: number;
  page?: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationMetadata;
}
