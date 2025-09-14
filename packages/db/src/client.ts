import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "./env.js";
import * as schema from "./schema.js";

export const client = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle({
	casing: "snake_case",
	client,
	schema,
});
