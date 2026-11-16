
import { describe, it, expect } from "vitest";

import { validateFilters } from "../src/validation/filters";

describe("Filter Validation", () => {
  const allowedFilters = {
    category: {
      type: "string",
      allowedValues: ["electronics", "clothing"]
    },
    price: {
      type: "number"
    },
    inStock: {
      type: "boolean"
    }
  } as const;

  it("should accept valid filters", () => {
    const filters = {
      category: "electronics",
      price: 500,
      inStock: true
    };

    expect(validateFilters(filters, allowedFilters)).toEqual(filters);
  });

  it("should accept an empty filter object", () => {
    expect(validateFilters({}, allowedFilters)).toEqual({});
  });

  it("should reject non-object filters", () => {
    expect(() => validateFilters(null, allowedFilters))
      .toThrow("Filters must be an object.");
  });

  it("should reject array filters", () => {
    expect(() => validateFilters([], allowedFilters))
      .toThrow("Filters must be an object.");
  });

  it("should reject unknown filters", () => {
    expect(() =>
      validateFilters({ password: "123" }, allowedFilters)
    ).toThrow('Filtering by "password" is not allowed.');
  });

  it("should reject incorrect filter types", () => {
    expect(() =>
      validateFilters({ price: "500" }, allowedFilters)
    ).toThrow('Filter "price" must be of type number.');
  });

  it("should reject invalid allowed values", () => {
    expect(() =>
      validateFilters({ category: "food" }, allowedFilters)
    ).toThrow(
      'Value "food" is not allowed for filter "category".'
    );
  });

  it("should reject non-finite numbers", () => {
    expect(() =>
      validateFilters({ price: Infinity }, allowedFilters)
    ).toThrow('Filter "price" must be a finite number.');
  });
});
