import { z } from "zod";

const QuerySchema = z.string("Query must be a string");

const PageSchema = z
	.number("Page must be a number")
	.min(1, "Page must at least 1");

const PageSizeSchema = z
	.number("Page size must be a number")
	.min(1, "Page size must at least 1")
	.max(100, "Page size must be at most 100");

export { PageSchema, PageSizeSchema, QuerySchema };
