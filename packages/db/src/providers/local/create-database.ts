import { drizzle } from "drizzle-orm/node-postgres";

import type { createClient } from "./create-client.js";

import * as schema from "../../schema.js";

type Options = {
	client: ReturnType<typeof createClient>;
};

export function createDatabase({ client }: Options) {
	return drizzle({
		schema,
		client,
		casing: "snake_case",
	});
}

export type Database = ReturnType<typeof createDatabase>;
