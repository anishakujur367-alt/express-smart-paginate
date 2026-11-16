
import type { RequestHandler } from "express";

import type {
  SmartPaginateOptions,
  FilterValue
} from "../types";

import {
  validatePage,
  validateLimit,
  validatePaginationMode,
  validateCursor
} from "../validation/pagination";

import {
  validateSortField,
  validateSortDirection
} from "../pagination/sorting";

import { validateFilters } from "../validation/filters";

export interface PaginationRequestData {
  mode: "offset" | "cursor";
  page?: number;
  limit: number;
  cursor?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filters: Record<string, FilterValue>;
}

declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationRequestData;
    }
  }
}

export function paginate(
  options: SmartPaginateOptions = {}
): RequestHandler {
  return (req, res, next) => {
    try {
      const query = req.query as Record<string, unknown>;

      const mode = validatePaginationMode(
        query.mode ?? options.mode ?? "offset"
      );

      const limit = validateLimit(
        query.limit,
        options.defaultLimit ?? 10,
        options.maxLimit ?? 100
      );

      let page: number | undefined;
      let cursor: string | undefined;

      if (mode === "offset") {
        page =
          query.page === undefined
            ? 1
            : validatePage(query.page);
      } else {
        cursor = validateCursor(query.cursor);
      }

      let sortBy: string | undefined;
      let sortDirection: "asc" | "desc" | undefined;

      if (query.sortBy !== undefined) {
        sortBy = validateSortField(
          query.sortBy,
          options.allowedSortFields ?? []
        );

        sortDirection = validateSortDirection(
          query.sortOrder ?? "asc"
        );
      }

      const rawFilters = query.filters ?? {};

      if (
        rawFilters === null ||
        typeof rawFilters !== "object" ||
        Array.isArray(rawFilters)
      ) {
        throw new Error("Filters must be an object.");
      }

      const convertedFilters: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(rawFilters)) {
        const definition = options.allowedFilters?.[key];

        if (!definition || typeof value !== "string") {
          convertedFilters[key] = value;
          continue;
        }

        if (definition.type === "number") {
          convertedFilters[key] =
            value.trim() === "" ? value : Number(value);
        } else if (definition.type === "boolean") {
          if (value === "true") {
            convertedFilters[key] = true;
          } else if (value === "false") {
            convertedFilters[key] = false;
          } else {
            convertedFilters[key] = value;
          }
        } else {
          convertedFilters[key] = value;
        }
      }

      const filters = validateFilters(
        convertedFilters,
        options.allowedFilters ?? {}
      );

      req.pagination = {
        mode,
        page,
        limit,
        cursor,
        sortBy,
        sortDirection,
        filters
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
