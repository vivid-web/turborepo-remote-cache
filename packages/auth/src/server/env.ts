import { createEnv } from "@t3-oss/env-core";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	server: {
		ADMIN_NAME: z.string().min(2).max(100).optional(),
		ADMIN_EMAIL: z.email().optional(),
		ADMIN_PASSWORD: z.string().min(8).max(100).optional(),
	},
	runtimeEnvStrict: {
		ADMIN_NAME: process.env.ADMIN_NAME,
		ADMIN_EMAIL: process.env.ADMIN_EMAIL,
		ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
	},
});
