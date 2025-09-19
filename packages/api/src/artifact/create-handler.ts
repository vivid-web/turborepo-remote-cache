import type { Storage } from "@turborepo-remote-cache/storage";

import { Hono } from "hono";

import { createRouter as createArtifactRouter } from "./routes/artifacts.js";

type Options = {
	basePath?: string;
	storage: Storage;
};

export function createHandler({
	basePath = "/v8/artifacts",
	storage,
}: Options) {
	const app = new Hono();

	const artifact = createArtifactRouter({ storage });

	app.route(basePath, artifact);

	return (request: Request) => app.fetch(request);
}
