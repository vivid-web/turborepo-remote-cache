import { z } from "zod";

const IdSchema = z.string("Id must be a string").min(1, "Id is required");

const QuerySchema = z.string("Query must me a string");

const PageSchema = z
	.number("Page must be a number")
	.min(1, "Page must at least 1");

const LimitSchema = z
	.number("Limit must be a number")
	.min(1, "Limit must at least 1")
	.max(100, "Limit must be at most 100");

export { IdSchema, LimitSchema, PageSchema, QuerySchema };
