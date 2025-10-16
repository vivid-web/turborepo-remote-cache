import type { PgSelect } from "drizzle-orm/pg-core";

import { invariant } from "@remote-cache/core";
import { count } from "@remote-cache/db";
import * as R from "remeda";

import { db } from "@/lib/db";

import type { Pagination } from "./pagination";

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
