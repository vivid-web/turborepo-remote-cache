import { z } from "zod";

export const PageSchema = z
	.number("Page must be a number")
	.min(1, "Page must at least 1");

export const LimitSchema = z
	.number("Page size must be a number")
	.min(1, "Page size must at least 1")
	.max(100, "Page size must be at most 100");

export const PaginationSchema = z.object({
	limit: LimitSchema.optional().default(10),
	page: PageSchema.optional().default(1),
});

export type Pagination = z.output<typeof PaginationSchema>;
