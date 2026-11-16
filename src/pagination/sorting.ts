
import type { SortDirection } from "../types";

export function validateSortDirection(
  direction: unknown = "asc"
): SortDirection {
  if (direction !== "asc" && direction !== "desc") {
    throw new Error("Sort direction must be either asc or desc.");
  }

  return direction;
}

export function validateSortField(
  field: unknown,
  allowedFields: readonly string[]
): string {
  if (typeof field !== "string" || field.trim() === "") {
    throw new Error("Sort field must be a non-empty string.");
  }

  if (!allowedFields.includes(field)) {
    throw new Error(`Sorting by "${field}" is not allowed.`);
  }

  return field;
}

export function sortData<T extends Record<string, unknown>>(
  data: T[],
  field: unknown,
  allowedFields: readonly string[],
  direction: unknown = "asc"
): T[] {
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array.");
  }

  const validField = validateSortField(field, allowedFields);
  const validDirection = validateSortDirection(direction);

  const sortedData = [...data];

  let valueType: "string" | "number" | undefined;

  for (const item of sortedData) {
    const value = item[validField];
    const currentType = typeof value;

    if (currentType !== "string" && currentType !== "number") {
      throw new Error(
        `Field "${validField}" must contain only strings or numbers.`
      );
    }

    if (currentType === "number" && !Number.isFinite(value)) {
      throw new Error(
        `Field "${validField}" must contain only finite numbers.`
      );
    }

    if (valueType === undefined) {
      valueType = currentType;
    } else if (currentType !== valueType) {
      throw new Error(
        `Field "${validField}" must contain values of the same type.`
      );
    }
  }

  return sortedData.sort((a, b) => {
    const valueA = a[validField];
    const valueB = b[validField];

    let comparison: number;

    if (
      typeof valueA === "number" &&
      typeof valueB === "number"
    ) {
      comparison = valueA - valueB;
    } else {
      comparison = String(valueA).localeCompare(String(valueB), undefined, {
        numeric: true,
        sensitivity: "base"
      });
    }

    return validDirection === "asc"
      ? comparison
      : -comparison;
  });
}
