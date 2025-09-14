import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { notFound, onError } from "stoker/middlewares";

import { logger } from "./middlewares/logger.js";
import artifacts from "./routes/artifacts.js";
import auth from "./routes/auth.js";

const app = new Hono();

app.use(requestId());
app.use(logger());
app.notFound(notFound);
app.onError(onError);

app.route("/auth", auth);
app.route("/v8/artifacts", artifacts);

export { app };
