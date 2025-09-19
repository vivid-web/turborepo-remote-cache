import { createEnv } from "@t3-oss/env-core";
import { netlify } from "@t3-oss/env-core/presets-zod";
import { env as auth } from "@turborepo-remote-cache/auth";
import { env as db } from "@turborepo-remote-cache/db";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	extends: [netlify(), auth, db],
	server: {
		API_URL: z.url(),

		// Netlify override as the `netlify` preset doesn't cast NETLIFY to a boolean
		NETLIFY: z.stringbool().optional(),
	},
	runtimeEnvStrict: {
		API_URL: process.env.API_URL,
		NETLIFY: process.env.NETLIFY,
	},
	emptyStringAsUndefined: true,
});
