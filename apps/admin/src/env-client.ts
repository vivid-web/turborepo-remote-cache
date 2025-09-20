import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

function getSafeEnv(input: unknown) {
	if (typeof input === "string") {
		return input;
	}

	return "";
}

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		// Sentry
		VITE_SENTRY_DSN: z.url().optional(),
	},
	runtimeEnvStrict: {
		VITE_SENTRY_DSN: getSafeEnv(import.meta.env.VITE_SENTRY_DSN),
	},
	emptyStringAsUndefined: true,
});
