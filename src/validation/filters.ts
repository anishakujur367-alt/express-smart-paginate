
import type {
  FilterDefinition,
  FilterValue
} from "../types";

export function validateFilters(
  filters: unknown,
  allowedFilters: Readonly<Record<string, FilterDefinition>>
): Record<string, FilterValue> {
  if (
    filters === null ||
    typeof filters !== "object" ||
    Array.isArray(filters)
  ) {
    throw new Error("Filters must be an object.");
  }

  const validatedFilters: Record<string, FilterValue> = {};

  for (const [key, value] of Object.entries(filters)) {
    const definition = allowedFilters[key];

    if (!definition) {
      throw new Error(`Filtering by "${key}" is not allowed.`);
    }

    if (typeof value !== definition.type) {
      throw new Error(
        `Filter "${key}" must be of type ${definition.type}.`
      );
    }

    if (
      definition.type === "number" &&
      !Number.isFinite(value)
    ) {
      throw new Error(
        `Filter "${key}" must be a finite number.`
      );
    }

    if (
      definition.allowedValues &&
      !definition.allowedValues.includes(value as never)
    ) {
      throw new Error(
        `Value "${String(value)}" is not allowed for filter "${key}".`
      );
    }

    validatedFilters[key] = value as FilterValue;
  }

  return validatedFilters;
}
