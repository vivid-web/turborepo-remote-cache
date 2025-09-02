import { Hono } from "hono";

const app = new Hono();

// POST /v8/artifacts
// https://turborepo.com/docs/openapi/artifacts/artifact-query
app.post("/", (c) => {
	return c.json("Not Found", 404);
});

// GET /v8/artifacts/status
// https://turborepo.com/docs/openapi/artifacts/record-events
app.get("/status", (c) => {
	return c.json("Not Found", 404);
});

// POST /v8/artifacts/events
// https://turborepo.com/docs/openapi/artifacts/record-events
app.post("/events", (c) => {
	return c.json("Not Found", 404);
});

// HEAD /v8/artifacts/{hash}
// https://turborepo.com/docs/openapi/artifacts/artifact-exists
app.on("HEAD", "/:hash", (c) => {
	return c.json("Not Found", 404);
});

// GET /v8/artifacts/{hash}
// https://turborepo.com/docs/openapi/artifacts/download-artifact
app.get("/:hash", (c) => {
	return c.json("Not Found", 404);
});

// PUT /v8/artifacts/{hash}
// https://turborepo.com/docs/openapi/artifacts/upload-artifact
app.put("/:hash", (c) => {
	return c.json("Not Found", 404);
});

export { app };
