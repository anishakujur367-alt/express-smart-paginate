
import { describe, it, expect } from "vitest";

import {
  formatSuccessResponse,
  formatErrorResponse
} from "../src/utils/response";

describe("API Response Formatter", () => {
  describe("formatSuccessResponse", () => {
    it("should return a standard success response", () => {
      const data = [{ id: 1, name: "Anisha" }];

      expect(formatSuccessResponse(data)).toEqual({
        success: true,
        message: "Request successful",
        data
      });
    });

    it("should accept a custom success message", () => {
      const data = [{ id: 1 }];

      expect(
        formatSuccessResponse(data, "Users fetched successfully")
      ).toEqual({
        success: true,
        message: "Users fetched successfully",
        data
      });
    });

    it("should include pagination metadata when provided", () => {
      const data = [{ id: 1 }];

      const pagination = {
        mode: "offset" as const,
        page: 1,
        limit: 10,
        total: 20,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false
      };

      expect(
        formatSuccessResponse(
          data,
          "Users fetched successfully",
          pagination
        )
      ).toEqual({
        success: true,
        message: "Users fetched successfully",
        data,
        pagination
      });
    });
  });

  describe("formatErrorResponse", () => {
    it("should return a standard error response", () => {
      expect(
        formatErrorResponse("Something went wrong")
      ).toEqual({
        success: false,
        message: "Something went wrong"
      });
    });

    it("should include error details when provided", () => {
      expect(
        formatErrorResponse(
          "Request failed",
          "Database connection failed"
        )
      ).toEqual({
        success: false,
        message: "Request failed",
        error: "Database connection failed"
      });
    });
  });
});
