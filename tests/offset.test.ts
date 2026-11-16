
import { describe, it, expect } from "vitest";

import {
  calculateOffset,
  paginateOffset
} from "../src/pagination/offset";

describe("Offset Pagination", () => {

  describe("calculateOffset", () => {
    it("should return 0 for page 1", () => {
      expect(calculateOffset(1, 10)).toBe(0);
    });

    it("should return 10 for page 2", () => {
      expect(calculateOffset(2, 10)).toBe(10);
    });

    it("should return 20 for page 3", () => {
      expect(calculateOffset(3, 10)).toBe(20);
    });

    it("should throw an error for page 0", () => {
      expect(() => calculateOffset(0, 10)).toThrow(
        "Page must be a positive integer."
      );
    });

    it("should throw an error for a negative page", () => {
      expect(() => calculateOffset(-1, 10)).toThrow(
        "Page must be a positive integer."
      );
    });

    it("should throw an error for decimal page", () => {
      expect(() => calculateOffset(1.5, 10)).toThrow(
        "Page must be a positive integer."
      );
    });

    it("should throw an error for limit 0", () => {
      expect(() => calculateOffset(1, 0)).toThrow(
        "Limit must be a positive integer."
      );
    });

    it("should throw an error for negative limit", () => {
      expect(() => calculateOffset(1, -10)).toThrow(
        "Limit must be a positive integer."
      );
    });
  });

  describe("paginateOffset", () => {
    const products = Array.from(
      { length: 25 },
      (_, index) => `Product ${index + 1}`
    );

    it("should return the first 10 products", () => {
      const result = paginateOffset(products, 1, 10, 25);

      expect(result.data).toHaveLength(10);
      expect(result.data[0]).toBe("Product 1");
      expect(result.data[9]).toBe("Product 10");
    });

    it("should return products from page 2", () => {
      const result = paginateOffset(products, 2, 10, 25);

      expect(result.data[0]).toBe("Product 11");
      expect(result.data[9]).toBe("Product 20");
    });

    it("should return the last 5 products", () => {
      const result = paginateOffset(products, 3, 10, 25);

      expect(result.data).toHaveLength(5);
      expect(result.data[0]).toBe("Product 21");
      expect(result.data[4]).toBe("Product 25");
    });

    it("should calculate pagination metadata", () => {
      const result = paginateOffset(products, 2, 10, 25);

      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });

    it("should identify the first page", () => {
      const result = paginateOffset(products, 1, 10, 25);

      expect(result.pagination.hasPreviousPage).toBe(false);
    });

    it("should identify the last page", () => {
      const result = paginateOffset(products, 3, 10, 25);

      expect(result.pagination.hasNextPage).toBe(false);
    });

    it("should reject negative total", () => {
      expect(() => paginateOffset(products, 1, 10, -1)).toThrow(
        "Total must be a non-negative integer."
      );
    });

    it("should reject decimal total", () => {
      expect(() => paginateOffset(products, 1, 10, 2.5)).toThrow(
        "Total must be a non-negative integer."
      );
    });

    it("should reject non-array data", () => {
      expect(() => paginateOffset(null as any, 1, 10, 25)).toThrow(
        "Data must be an array."
      );
    });
  });
});
