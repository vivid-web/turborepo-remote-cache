import { createEnv } from "@t3-oss/env-core";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	server: {
		BASE_URL: z.url(),

		LOCAL_STORAGE_PATH: z.string().min(1),
	},
	runtimeEnvStrict: {
		BASE_URL: process.env.BASE_URL,

		LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH,
	},
});
