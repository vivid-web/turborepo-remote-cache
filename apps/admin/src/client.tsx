import * as Sentry from "@sentry/tanstackstart-react";
import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";

import { env } from "./env-client";
import { createRouter } from "./router";

const router = createRouter();

Sentry.init({
	dsn: env.VITE_SENTRY_DSN,

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	integrations: [
		Sentry.tanstackRouterBrowserTracingIntegration(router),
		Sentry.replayIntegration(),
		Sentry.feedbackIntegration({
			// Additional SDK configuration goes in here, for example:
			colorScheme: "system",
		}),
	],

	// Enable logs to be sent to Sentry
	enableLogs: true,

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for tracing.
	// We recommend adjusting this value in production.
	// Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
	tracesSampleRate: 1.0,

	// Capture Replay for 10% of all sessions,
	// plus for 100% of sessions with an error.
	// Learn more at https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
	replaysSessionSampleRate: 0.1,

	replaysOnErrorSampleRate: 1.0,
});

hydrateRoot(document, <StartClient router={router} />);
