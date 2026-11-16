
import { describe, it, expect } from "vitest";

import {
  validateSortDirection,
  validateSortField,
  sortData
} from "../src/pagination/sorting";

describe("Safe Sorting", () => {
  describe("validateSortDirection", () => {
    it("should accept ascending direction", () => {
      expect(validateSortDirection("asc")).toBe("asc");
    });

    it("should accept descending direction", () => {
      expect(validateSortDirection("desc")).toBe("desc");
    });

    it("should use ascending as the default direction", () => {
      expect(validateSortDirection()).toBe("asc");
    });

    it("should reject invalid directions", () => {
      expect(() => validateSortDirection("random"))
        .toThrow("Sort direction must be either asc or desc.");
    });
  });

  describe("validateSortField", () => {
    const allowedFields = ["name", "price", "createdAt"];

    it("should accept an allowed field", () => {
      expect(validateSortField("name", allowedFields)).toBe("name");
    });

    it("should reject a field that is not allowed", () => {
      expect(() => validateSortField("password", allowedFields))
        .toThrow('Sorting by "password" is not allowed.');
    });

    it("should reject an empty field", () => {
      expect(() => validateSortField("", allowedFields))
        .toThrow("Sort field must be a non-empty string.");
    });

    it("should reject a non-string field", () => {
      expect(() => validateSortField(123, allowedFields))
        .toThrow("Sort field must be a non-empty string.");
    });
  });

  describe("sortData", () => {
    const products = [
      { name: "Laptop", price: 50000 },
      { name: "Phone", price: 20000 },
      { name: "Tablet", price: 30000 }
    ];

    const allowedFields = ["name", "price"];

    it("should sort numbers in ascending order", () => {
      const result = sortData(products, "price", allowedFields, "asc");

      expect(result.map((item) => item.price)).toEqual([
        20000, 30000, 50000
      ]);
    });

    it("should sort numbers in descending order", () => {
      const result = sortData(products, "price", allowedFields, "desc");

      expect(result.map((item) => item.price)).toEqual([
        50000, 30000, 20000
      ]);
    });

    it("should sort strings in ascending order", () => {
      const result = sortData(products, "name", allowedFields, "asc");

      expect(result.map((item) => item.name)).toEqual([
        "Laptop", "Phone", "Tablet"
      ]);
    });

    it("should sort strings in descending order", () => {
      const result = sortData(products, "name", allowedFields, "desc");

      expect(result.map((item) => item.name)).toEqual([
        "Tablet", "Phone", "Laptop"
      ]);
    });

    it("should use ascending order by default", () => {
      const result = sortData(products, "price", allowedFields);

      expect(result.map((item) => item.price)).toEqual([
        20000, 30000, 50000
      ]);
    });

    it("should reject a field that is not allowed", () => {
      expect(() =>
        sortData(products, "password", allowedFields)
      ).toThrow('Sorting by "password" is not allowed.');
    });

    it("should reject invalid directions", () => {
      expect(() =>
        sortData(products, "price", allowedFields, "random")
      ).toThrow("Sort direction must be either asc or desc.");
    });

    it("should not modify the original array", () => {
      const original = [...products];

      sortData(products, "price", allowedFields);

      expect(products).toEqual(original);
    });

    it("should return an empty array when input is empty", () => {
      expect(sortData([], "price", allowedFields)).toEqual([]);
    });

    it("should reject invalid sorting values", () => {
      const invalidProducts = [
        { name: "Laptop", price: 50000 },
        { name: "Phone", price: null }
      ];

      expect(() =>
        sortData(invalidProducts, "price", allowedFields)
      ).toThrow(
        'Field "price" must contain only strings or numbers.'
      );
    });

    it("should reject mixed string and number values", () => {
      const mixedProducts = [
        { name: "Laptop", price: 50000 },
        { name: "Phone", price: "20000" }
      ];

      expect(() =>
        sortData(mixedProducts, "price", allowedFields)
      ).toThrow(
        'Field "price" must contain values of the same type.'
      );
    });

    it("should reject non-array data", () => {
      expect(() =>
        sortData(null as any, "price", allowedFields)
      ).toThrow("Data must be an array.");
    });
  });
});
