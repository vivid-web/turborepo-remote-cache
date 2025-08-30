import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { app as artifacts } from "./routes/artifacts.js";

const app = new Hono();

app.use(logger());

app.route("/v8/artifacts", artifacts);

const server = serve({
	fetch: app.fetch,
	port: 3001,
});

process.on("SIGINT", () => {
	server.close();

	process.exit(0);
});

process.on("SIGTERM", () => {
	server.close((err) => {
		if (err) {
			console.error(err);

			process.exit(1);
		}

		process.exit(0);
	});
});
