import { createEnv } from "@t3-oss/env-core";
import { env as db } from "@turborepo-remote-cache/db";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	extends: [db],
	server: {
		BETTER_AUTH_SECRET: z.string().min(32).max(128).optional(),
		BETTER_AUTH_URL: z.url().optional(),
	},
	runtimeEnvStrict: {
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	},
	emptyStringAsUndefined: true,
});
