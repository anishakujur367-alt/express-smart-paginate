import { describe, it, expect } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { paginate } from "../src/middleware/paginate";

function runMiddleware(
  middleware: ReturnType<typeof paginate>,
  query: Record<string, unknown>
) {
  const req = {
    query
  } as unknown as Request;

  let error: unknown;
  let nextCalled = false;

  const next: NextFunction = (err?: unknown) => {
    if (err) {
      error = err;
    } else {
      nextCalled = true;
    }
  };

  middleware(req, {} as Response, next);

  return {
    req,
    error,
    nextCalled
  };
}

describe("paginate middleware", () => {
  it("uses default pagination values", () => {
    const result = runMiddleware(paginate(), {});

    expect(result.nextCalled).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.req.pagination).toEqual({
      mode: "offset",
      page: 1,
      limit: 10,
      cursor: undefined,
      sortBy: undefined,
      sortDirection: undefined,
      filters: {}
    });
  });

  it("accepts valid page and limit", () => {
    const result = runMiddleware(paginate(), {
      page: "2",
      limit: "20"
    });

    expect(result.nextCalled).toBe(true);
    expect(result.req.pagination?.page).toBe(2);
    expect(result.req.pagination?.limit).toBe(20);
  });

  it("rejects an invalid page", () => {
    const result = runMiddleware(paginate(), {
      page: "0"
    });

    expect(result.nextCalled).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("rejects a limit above the maximum", () => {
    const result = runMiddleware(paginate(), {
      limit: "150"
    });

    expect(result.nextCalled).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("accepts cursor mode", () => {
    const result = runMiddleware(paginate(), {
      mode: "cursor",
      cursor: "abc123"
    });

    expect(result.nextCalled).toBe(true);
    expect(result.req.pagination?.mode).toBe("cursor");
    expect(result.req.pagination?.cursor).toBe("abc123");
  });

  it("rejects an invalid pagination mode", () => {
    const result = runMiddleware(paginate(), {
      mode: "invalid"
    });

    expect(result.nextCalled).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("accepts allowed sorting", () => {
    const result = runMiddleware(
      paginate({
        allowedSortFields: ["name", "price"]
      }),
      {
        sortBy: "price",
        sortOrder: "desc"
      }
    );

    expect(result.nextCalled).toBe(true);
    expect(result.req.pagination?.sortBy).toBe("price");
    expect(result.req.pagination?.sortDirection).toBe("desc");
  });

  it("rejects sorting by a field that is not allowed", () => {
    const result = runMiddleware(
      paginate({
        allowedSortFields: ["name"]
      }),
      {
        sortBy: "password"
      }
    );

    expect(result.nextCalled).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("converts numeric filters", () => {
    const result = runMiddleware(
      paginate({
        allowedFilters: {
          price: { type: "number" }
        }
      }),
      {
        filters: {
          price: "500"
        }
      }
    );

    expect(result.nextCalled).toBe(true);
    expect(result.req.pagination?.filters).toEqual({
      price: 500
    });
  });

  it("converts boolean filters", () => {
    const result = runMiddleware(
      paginate({
        allowedFilters: {
          available: { type: "boolean" }
        }
      }),
      {
        filters: {
          available: "true"
        }
      }
    );

    expect(result.nextCalled).toBe(true);
    expect(result.req.pagination?.filters).toEqual({
      available: true
    });
  });

  it("rejects filters that are not allowed", () => {
    const result = runMiddleware(paginate(), {
      filters: {
        password: "secret"
      }
    });

    expect(result.nextCalled).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });
});