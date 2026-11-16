
import { describe, it, expect } from "vitest";

import {
  encodeCursor,
  decodeCursor,
  paginateCursor
} from "../src/pagination/cursor";

describe("Cursor Pagination", () => {
  describe("encodeCursor", () => {
    it("should encode a string value", () => {
      expect(decodeCursor(encodeCursor("10"))).toBe("10");
    });

    it("should encode a number value", () => {
      expect(decodeCursor(encodeCursor(25))).toBe("25");
    });

    it("should reject an empty string", () => {
      expect(() => encodeCursor("")).toThrow(
        "Cursor value must be a valid string or number."
      );
    });

    it("should reject an invalid number", () => {
      expect(() => encodeCursor(Infinity)).toThrow(
        "Cursor value must be a valid string or number."
      );
    });
  });

  describe("decodeCursor", () => {
    it("should decode a valid cursor", () => {
      const cursor = encodeCursor("15");

      expect(decodeCursor(cursor)).toBe("15");
    });

    it("should reject an empty cursor", () => {
      expect(() => decodeCursor("")).toThrow("Invalid cursor.");
    });

    it("should reject a malformed cursor", () => {
      expect(() => decodeCursor("invalid@@@")).toThrow(
        "Invalid cursor."
      );
    });
  });

  describe("paginateCursor", () => {
    const products = Array.from(
      { length: 25 },
      (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`
      })
    );

    it("should return the first 10 products", () => {
      const result = paginateCursor(products, 10);

      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(1);
      expect(result.data[9].id).toBe(10);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(false);
    });

    it("should return the next 10 products using a cursor", () => {
      const firstPage = paginateCursor(products, 10);

      const secondPage = paginateCursor(
        products,
        10,
        firstPage.pagination.nextCursor
      );

      expect(secondPage.data).toHaveLength(10);
      expect(secondPage.data[0].id).toBe(11);
      expect(secondPage.data[9].id).toBe(20);
      expect(secondPage.pagination.hasPreviousPage).toBe(true);
    });

    it("should return the remaining 5 products", () => {
      const firstPage = paginateCursor(products, 10);

      const secondPage = paginateCursor(
        products,
        10,
        firstPage.pagination.nextCursor
      );

      const thirdPage = paginateCursor(
        products,
        10,
        secondPage.pagination.nextCursor
      );

      expect(thirdPage.data).toHaveLength(5);
      expect(thirdPage.data[0].id).toBe(21);
      expect(thirdPage.data[4].id).toBe(25);
      expect(thirdPage.pagination.hasNextPage).toBe(false);
      expect(thirdPage.pagination.hasPreviousPage).toBe(true);
    });

    it("should return the previous 10 products using a cursor", () => {
      const firstPage = paginateCursor(products, 10);

      const secondPage = paginateCursor(
        products,
        10,
        firstPage.pagination.nextCursor
      );

      const previousPage = paginateCursor(
        products,
        10,
        secondPage.pagination.previousCursor,
        "id",
        "previous"
      );

      expect(previousPage.data).toHaveLength(10);
      expect(previousPage.data[0].id).toBe(1);
      expect(previousPage.data[9].id).toBe(10);
      expect(previousPage.pagination.hasPreviousPage).toBe(false);
    });

    it("should reject a cursor that does not exist", () => {
      const invalidCursor = encodeCursor("999");

      expect(() =>
        paginateCursor(products, 10, invalidCursor)
      ).toThrow("Cursor not found.");
    });

    it("should reject a zero limit", () => {
      expect(() => paginateCursor(products, 0)).toThrow(
        "Limit must be a positive integer."
      );
    });

    it("should reject a negative limit", () => {
      expect(() => paginateCursor(products, -5)).toThrow(
        "Limit must be a positive integer."
      );
    });

    it("should reject a decimal limit", () => {
      expect(() => paginateCursor(products, 1.5)).toThrow(
        "Limit must be a positive integer."
      );
    });

    it("should reject an invalid direction", () => {
      expect(() =>
        paginateCursor(products, 10, undefined, "id", "invalid" as any)
      ).toThrow("Direction must be next or previous.");
    });

    it("should reject an empty cursor", () => {
      expect(() =>
        paginateCursor(products, 10, "")
      ).toThrow("Invalid cursor.");
    });

    it("should reject duplicate cursor field values", () => {
      const duplicateProducts = [
        { id: 1, name: "Product A" },
        { id: 1, name: "Product B" }
      ];

      expect(() =>
        paginateCursor(duplicateProducts, 10)
      ).toThrow("Cursor field values must be unique.");
    });

    it("should reject records with missing cursor fields", () => {
      const invalidProducts = [
        { id: 1, name: "Product A" },
        { name: "Product B" }
      ];

      expect(() =>
        paginateCursor(invalidProducts, 10)
      ).toThrow("Every record must have a valid cursor field.");
    });
  });
});
