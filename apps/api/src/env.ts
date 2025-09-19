import { createEnv } from "@t3-oss/env-core";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	server: {
		ADMIN_URL: z.url(),
		BASE_URL: z.url(),

		LOCAL_STORAGE_PATH: z.string().min(1),

		LOG_LEVEL: z.literal("info").optional(),

		NODE_ENV: z.literal("production").optional(),
	},
	runtimeEnvStrict: {
		ADMIN_URL: process.env.ADMIN_URL,
		BASE_URL: process.env.BASE_URL,
		LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH,
		LOG_LEVEL: process.env.LOG_LEVEL,
		NODE_ENV: process.env.NODE_ENV,
	},
	emptyStringAsUndefined: true,
});
