import * as Sentry from "@sentry/tanstackstart-react";
import {
	createMiddleware,
	registerGlobalMiddleware,
} from "@tanstack/react-start";

const sentry = createMiddleware({ type: "function" }).server(
	Sentry.sentryGlobalServerMiddlewareHandler(),
);

registerGlobalMiddleware({
	middleware: [sentry],
});
