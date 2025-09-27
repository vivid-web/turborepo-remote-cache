import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		// Sentry
		VITE_SENTRY_DSN: z.url().optional(),
	},
	runtimeEnvStrict: {
		/* eslint-disable @typescript-eslint/no-unsafe-assignment */
		VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
		/* eslint-enable @typescript-eslint/no-unsafe-assignment */
	},
	emptyStringAsUndefined: true,
});
