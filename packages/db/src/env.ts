import { createEnv } from "@t3-oss/env-core";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z
			.url()
			.optional()
			.default("postgresql://postgres:postgres@localhost:5432/main"),
	},
	runtimeEnvStrict: {
		DATABASE_URL: process.env.DATABASE_URL,
	},
	emptyStringAsUndefined: true,
});
