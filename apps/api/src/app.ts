import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { notFound, onError } from "stoker/middlewares";

import artifacts from "./routes/artifacts.js";

const app = new Hono();

app.use(requestId());
app.use(logger());
app.notFound(notFound);
app.onError(onError);

app.route("/v8/artifacts", artifacts);

export { app };
