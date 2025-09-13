import "dotenv/config";
import { serve } from "@hono/node-server";

import { app } from "./app.js";

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
