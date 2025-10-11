import { createEnv } from "@t3-oss/env-core";
import { netlify } from "@t3-oss/env-core/presets-zod";
import { process } from "std-env";
import { z } from "zod";

export const env = createEnv({
	extends: [netlify()],
	server: {
		BASE_URL: z.url(),

		// Netlify override as the `netlify` preset doesn't cast NETLIFY to a boolean
		NETLIFY: z.stringbool().optional(),
	},
	runtimeEnvStrict: {
		BASE_URL: process.env.BASE_URL,
		NETLIFY: process.env.NETLIFY,
	},
	emptyStringAsUndefined: true,
});
