import { defineConfig } from "drizzle-kit";

export default defineConfig({
	casing: "snake_case",
	dbCredentials: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		url: process.env.DATABASE_URL!,
	},
	dialect: "postgresql",
	out: "./migrations",
	schema: "./src/schema.ts",
});
