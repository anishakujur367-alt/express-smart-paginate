
import { describe, it, expect } from "vitest";

import {
  validatePage,
  validateLimit,
  validatePaginationMode,
  validateCursor
} from "../src/validation/pagination";

describe("Pagination Validation", () => {

  describe("validatePage", () => {
    it("should accept a valid page number", () => {
      expect(validatePage(5)).toBe(5);
    });

    it("should reject zero", () => {
      expect(() => validatePage(0)).toThrow();
    });

    it("should reject negative numbers", () => {
      expect(() => validatePage(-2)).toThrow();
    });

    it("should reject decimal numbers", () => {
      expect(() => validatePage(2.5)).toThrow();
    });
  });

  describe("validateLimit", () => {
    it("should use default limit when not provided", () => {
      expect(validateLimit(undefined)).toBe(10);
    });

    it("should accept a valid limit", () => {
      expect(validateLimit(20)).toBe(20);
    });

    it("should reject a limit above maximum", () => {
      expect(() => validateLimit(101)).toThrow();
    });

    it("should reject zero", () => {
      expect(() => validateLimit(0)).toThrow();
    });
  });

  describe("validatePaginationMode", () => {
    it("should default to offset mode", () => {
      expect(validatePaginationMode()).toBe("offset");
    });

    it("should accept cursor mode", () => {
      expect(validatePaginationMode("cursor")).toBe("cursor");
    });

    it("should reject invalid modes", () => {
      expect(() => validatePaginationMode("invalid")).toThrow();
    });
  });

  describe("validateCursor", () => {
    it("should accept a valid cursor", () => {
      expect(validateCursor("abc123")).toBe("abc123");
    });

    it("should allow an undefined cursor", () => {
      expect(validateCursor(undefined)).toBeUndefined();
    });

    it("should reject an empty cursor", () => {
      expect(() => validateCursor("")).toThrow();
    });

    it("should reject a non-string cursor", () => {
      expect(() => validateCursor(123)).toThrow();
    });
  });

});
