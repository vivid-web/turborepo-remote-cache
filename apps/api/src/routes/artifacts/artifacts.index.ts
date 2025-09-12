import { createRouter } from "../../lib/create-router.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import * as handlers from "./artifacts.handlers.js";
import * as routes from "./artifacts.routes.js";

const router = createRouter();

router.use(authMiddleware());

router
	.openapi(routes.recordEvents, handlers.recordEvents)
	.openapi(routes.status, handlers.status)
	.openapi(routes.uploadArtifact, handlers.uploadArtifact)
	.openapi(routes.downloadArtifact, handlers.downloadArtifact)
	.openapi(routes.artifactExists, handlers.artifactExists)
	.openapi(routes.artifactQuery, handlers.artifactQuery);

export default router;
