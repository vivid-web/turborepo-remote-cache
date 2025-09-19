import { Hono } from "hono";

import artifacts from "./routes/artifacts.js";

type Options = {
	basePath?: string;
};

export function createHandler({ basePath = "/v8/artifacts" }: Options = {}) {
	const app = new Hono();

	app.route(basePath, artifacts);

	return (request: Request) => app.fetch(request);
}
