# express-smart-paginate

A lightweight TypeScript-friendly Express middleware and utility package for pagination, sorting, filter validation, and consistent API responses.

## Features

- Offset pagination
- Cursor pagination
- Safe sorting with an allowlist
- Filter validation with type checking
- Express middleware for validating query parameters
- Standard success and error response formatters
- TypeScript support with declaration files

## Installation

```bash
npm install express-smart-paginate
```

Express is a peer dependency, so make sure Express is also installed:

```bash
npm install express
```

## Quick Start

```typescript
import express from "express";
import { paginate } from "express-smart-paginate";

const app = express();

app.set("query parser", "extended");
app.use(express.json());

app.get(
  "/products",
  paginate({
    defaultLimit: 10,
    maxLimit: 50,
    allowedSortFields: ["name", "price"],
    allowedFilters: {
      category: {
        type: "string",
        allowedValues: ["electronics", "clothing"]
      },
      price: {
        type: "number"
      },
      available: {
        type: "boolean"
      }
    }
  }),
  (req, res) => {
    res.json({
      message: "Pagination parameters validated",
      pagination: req.pagination
    });
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Pagination Middleware

The `paginate()` middleware validates pagination, sorting, and filter parameters and attaches the validated values to `req.pagination`.

### Available query parameters

| Parameter | Description | Example |
|---|---|---|
| `mode` | Pagination mode | `offset` or `cursor` |
| `page` | Page number | `2` |
| `limit` | Records per page | `10` |
| `cursor` | Cursor value | `MTAw` |
| `sortBy` | Field to sort by | `price` |
| `sortOrder` | Sort direction | `asc` or `desc` |
| `filters` | Filter object | `filters[category]=electronics` |

**Important:** Express uses the simple query parser by default. To support nested filter parameters such as `filters[category]=electronics`, configure the extended query parser:

```typescript
app.set("query parser", "extended");
```

### Middleware configuration

```typescript
paginate({
  mode: "offset",
  defaultLimit: 10,
  maxLimit: 100,
  allowedSortFields: ["name", "price"],
  allowedFilters: {
    category: {
      type: "string",
      allowedValues: ["electronics", "clothing"]
    },
    price: {
      type: "number"
    },
    available: {
      type: "boolean"
    }
  }
});
```

### Access validated parameters

```typescript
app.get("/products", paginate(), (req, res) => {
  const {
    mode,
    page,
    limit,
    sortBy,
    sortDirection,
    filters
  } = req.pagination!;

  res.json({
    mode,
    page,
    limit,
    sortBy,
    sortDirection,
    filters
  });
});
```

Example request:

```text
GET /products?page=2&limit=10&sortBy=price&sortOrder=desc
```

Example filter request:

```text
GET /products?filters[category]=electronics&filters[price]=500
```

## Offset Pagination

Use `calculateOffset()` to calculate the database offset.

```typescript
import { calculateOffset } from "express-smart-paginate";

const offset = calculateOffset(2, 10);

console.log(offset); // 10
```

Use `paginateOffset()` to paginate an in-memory array.

```typescript
import { paginateOffset } from "express-smart-paginate";

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Tablet" }
];

const result = paginateOffset(products, 1, 2, 3);

console.log(result);
```

## Cursor Pagination

Cursor pagination uses a unique and stable field to identify records.

```typescript
import {
  encodeCursor,
  decodeCursor,
  paginateCursor
} from "express-smart-paginate";

const cursor = encodeCursor(2);

console.log(decodeCursor(cursor)); // "2"

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Tablet" }
];

const result = paginateCursor(products, 2, undefined, "id");

console.log(result);
```

To get the next page, pass the returned `nextCursor`:

```typescript
const nextPage = paginateCursor(
  products,
  2,
  result.pagination.nextCursor,
  "id"
);
```

**Note:** Cursor encoding uses Base64URL encoding. It is not encryption. Never use sensitive information as a cursor value.

## Safe Sorting

Only fields included in the allowlist can be sorted.

```typescript
import { sortData } from "express-smart-paginate";

const products = [
  { name: "Phone", price: 500 },
  { name: "Laptop", price: 1200 },
  { name: "Tablet", price: 800 }
];

const sorted = sortData(
  products,
  "price",
  ["name", "price"],
  "asc"
);

console.log(sorted);
```

## Filter Validation

Define allowed filters and their expected types.

```typescript
import { validateFilters } from "express-smart-paginate";

const filters = validateFilters(
  {
    category: "electronics",
    price: 500
  },
  {
    category: {
      type: "string",
      allowedValues: ["electronics", "clothing"]
    },
    price: {
      type: "number"
    }
  }
);

console.log(filters);
```

## Standard API Responses

### Success response

```typescript
import { formatSuccessResponse } from "express-smart-paginate";

const response = formatSuccessResponse(
  [{ id: 1, name: "Laptop" }],
  "Products fetched successfully"
);

console.log(response);
```

### Error response

```typescript
import { formatErrorResponse } from "express-smart-paginate";

const response = formatErrorResponse(
  "Unable to fetch products",
  "Database connection failed"
);

console.log(response);
```

## Error Handling

The middleware forwards validation errors to Express using `next(error)`.

You can handle them with Express error-handling middleware:

```typescript
app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    message: err.message
  });
});
```

## Important Notes

- The pagination, sorting, and cursor helper functions work with in-memory arrays.
- The middleware validates and attaches query parameters; it does not automatically execute database queries.
- Developers must apply validated pagination, sorting, and filters to their database queries.
- Use an allowlist when applying sorting to database queries. Never insert raw user input into SQL.
- Cursor pagination requires a unique and stable cursor field.
- Cursor encoding is not encryption.
- Configure Express with the extended query parser when using nested filter query parameters.

## TypeScript Support

This package includes TypeScript declaration files and supports TypeScript projects.

## License

MIT License