import type { PgSelect } from "drizzle-orm/pg-core";

import { invariant } from "@remote-cache/core";
import { count } from "@remote-cache/db";
import * as R from "remeda";
import { z } from "zod";

import { db } from "@/lib/db";

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

async function totalItemsForQuery(
	query: PgSelect,
	{ limit, page }: Pagination,
) {
	const result = await db
		.select({ count: count() })
		// @ts-expect-error Unfortunately Drizzle doesn't allow accessing the config
		.from(query.config.table)
		// @ts-expect-error Unfortunately Drizzle doesn't allow accessing the config
		.where(query.config.where)
		.then(R.first());

	invariant(result, "Count query should return a result");

	return {
		page,
		limit,
		totalPages: Math.ceil(result.count / limit),
		totalItems: result.count,
	};
}

async function resultForQuery<T extends PgSelect>(
	query: T,
	{ limit, page }: Pagination,
) {
	return query.limit(limit).offset((page - 1) * limit);
}

export async function withPagination<T extends PgSelect>(
	query: T,
	pagination: Pagination,
) {
	return Promise.all([
		resultForQuery(query, pagination),
		totalItemsForQuery(query, pagination),
	]);
}
