import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { notFound, onError } from "stoker/middlewares";

import { logMiddleware } from "./middlewares/log-middleware.js";
import artifacts from "./routes/artifacts.js";

const app = new Hono();

app.use(requestId());
app.use(logMiddleware());
app.notFound(notFound);
app.onError(onError);

app.route("/v8/artifacts", artifacts);

export { app };
