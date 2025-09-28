import * as Sentry from "@sentry/tanstackstart-react";
import { createMiddleware, createStart } from "@tanstack/react-start";

import { logger } from "./middlewares/logger";

const sentry = createMiddleware({ type: "function" }).server(
	Sentry.sentryGlobalServerMiddlewareHandler(),
);

export const startInstance = createStart(() => ({
	requestMiddleware: [logger],
	functionMiddleware: [sentry],
}));
