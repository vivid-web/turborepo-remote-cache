import * as Sentry from "@sentry/tanstackstart-react";
import { createMiddleware, createStart } from "@tanstack/react-start";

const sentry = createMiddleware({ type: "function" }).server(
	Sentry.sentryGlobalServerMiddlewareHandler(),
);

export const startInstance = createStart(() => ({
	functionMiddleware: [sentry],
}));
