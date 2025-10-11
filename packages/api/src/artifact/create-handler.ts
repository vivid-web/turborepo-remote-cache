import type { Database } from "@remote-cache/db";
import type { Storage } from "@remote-cache/storage";

import { Hono } from "hono";

import { createRouter as createArtifactRouter } from "./routes/artifacts.js";

type Options = {
	basePath?: string;
	database: Database;
	storage: Storage;
};

export function createHandler({
	basePath = "/v8/artifacts",
	storage,
	database,
}: Options) {
	const app = new Hono();

	const artifact = createArtifactRouter({ storage, database });

	app.route(basePath, artifact);

	return (request: Request) => app.fetch(request);
}
