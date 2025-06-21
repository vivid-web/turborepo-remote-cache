import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client = neon(process.env.DATABASE_URL!);

export const db = drizzle({
	casing: "snake_case",
	client,
	schema,
});
