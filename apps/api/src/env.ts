import { createEnv } from "@t3-oss/env-core";
import { netlify } from "@t3-oss/env-core/presets-zod";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	extends: [netlify()],
	server: {
		ADMIN_URL: z.url(),
		BASE_URL: z.url(),

		// Storage
		STORAGE_PROVIDER: z.literal(["local", "netlify-blobs"]),

		// Local storage
		LOCAL_STORAGE_PATH: z.string().min(1).optional(),

		// Netlify Blobs
		NETLIFY_BLOBS_STORE_NAME: z.string().min(1).optional(),
		NETLIFY_BLOBS_SITE_ID: z.string().min(1).optional(),
		NETLIFY_BLOBS_TOKEN: z.string().min(1).optional(),

		LOG_LEVEL: z.literal("info").optional(),

		NODE_ENV: z.literal("production").optional(),

		// Netlify override as the `netlify` preset doesn't cast NETLIFY to a boolean
		NETLIFY: z.stringbool().optional(),
	},
	runtimeEnvStrict: {
		ADMIN_URL: process.env.ADMIN_URL,
		BASE_URL: process.env.BASE_URL,
		STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
		LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH,
		NETLIFY_BLOBS_STORE_NAME: process.env.NETLIFY_BLOBS_STORE_NAME,
		NETLIFY_BLOBS_SITE_ID: process.env.NETLIFY_BLOBS_SITE_ID,
		NETLIFY_BLOBS_TOKEN: process.env.NETLIFY_BLOBS_TOKEN,
		LOG_LEVEL: process.env.LOG_LEVEL,
		NODE_ENV: process.env.NODE_ENV,
		NETLIFY: process.env.NETLIFY,
	},
	emptyStringAsUndefined: true,
});
