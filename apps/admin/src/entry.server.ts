import * as Sentry from "@sentry/tanstackstart-react";
import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/react-start/server";

import { env } from "./env.server";

Sentry.init({
	dsn: env.VITE_SENTRY_DSN,

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	// Enable logs to be sent to Sentry
	enableLogs: true,

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for tracing.
	// We recommend adjusting this value in production
	// Learn more at
	// https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
	tracesSampleRate: 1.0,
});

const fetch = createStartHandler((ctx) => {
	return Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler(ctx));
});

export default {
	fetch,
};
