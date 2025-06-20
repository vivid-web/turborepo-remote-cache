import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const client = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({
	casing: "snake_case",
	client,
});
