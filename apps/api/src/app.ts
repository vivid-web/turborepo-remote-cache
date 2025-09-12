import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { notFound, onError } from "stoker/middlewares";

import { createRouter } from "./lib/create-router.js";
import artifacts from "./routes/artifacts/artifacts.index.js";

const app = createRouter();

app.use(requestId());
app.use(logger());
app.notFound(notFound);
app.onError(onError);

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
	type: "http",
	scheme: "bearer",
});

app.doc("/doc", {
	openapi: "3.0.3",
	info: {
		title: "Turborepo Remote Cache API",
		description:
			"Turborepo is an intelligent build system optimized for JavaScript and TypeScript codebases.",
		version: "8.0.0",
	},
});

app.route("/", artifacts);

export { app };
