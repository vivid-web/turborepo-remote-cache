import { zValidator } from "@hono/zod-validator";
import { invariant } from "@turborepo-remote-cache/core";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";

import { env } from "../env.js";
import { ENABLED_STATUS } from "../lib/constants.js";
import { createArtifact } from "../lib/mutations.js";
import {
	getArtifactForTeam,
	getTeamForUserWithTeamIdOrSlug,
} from "../lib/queries.js";
import { HashSchema, SlugSchema, TeamIdSchema } from "../lib/schemas.js";
import { storage } from "../lib/storage.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = new Hono();

router.use(authMiddleware());

// https://turborepo.com/docs/openapi/artifacts/record-events
router.post("/events", (c) => {
	// todo: not yet implemented
	return c.json("", HttpStatusCodes.OK);
});

// https://turborepo.com/docs/openapi/artifacts/status
router.get("/status", (c) => {
	return c.json({ status: ENABLED_STATUS }, HttpStatusCodes.OK);
});

// https://turborepo.com/docs/openapi/artifacts/upload-artifact
router.put(
	"/:hash",
	zValidator("param", z.object({ hash: HashSchema })),
	zValidator("query", z.object({ teamId: TeamIdSchema, slug: SlugSchema })),
	async (c) => {
		const user = c.get("user");
		const { hash } = c.req.param();
		const { teamId, slug } = c.req.query();

		invariant(user, "User should be authenticated by now");

		if (!teamId && !slug) {
			return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
		}

		const team = await getTeamForUserWithTeamIdOrSlug(user.id, {
			teamId,
			slug,
		});

		if (!team) {
			return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
		}

		const blob = await c.req.blob();

		await storage.set(hash, blob);
		await createArtifact({ hash, teamId: team.id });

		const urls = [`${env.BASE_URL}/v8/artifacts/${hash}`];

		return c.json({ urls }, HttpStatusCodes.ACCEPTED);
	},
);

// https://turborepo.com/docs/openapi/artifacts/download-artifact
router.get(
	"/:hash",
	zValidator("param", z.object({ hash: HashSchema })),
	zValidator("query", z.object({ teamId: TeamIdSchema, slug: SlugSchema })),
	async (c) => {
		const user = c.get("user");
		const { hash } = c.req.param();
		const { teamId, slug } = c.req.query();

		invariant(user, "User should be authenticated by now");

		if (!teamId && !slug) {
			return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
		}

		const team = await getTeamForUserWithTeamIdOrSlug(user.id, {
			teamId,
			slug,
		});

		if (!team) {
			return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
		}

		const artifact = await getArtifactForTeam(team.id, hash);

		if (!artifact) {
			return c.json("Not Found", HttpStatusCodes.NOT_FOUND);
		}

		const blob = await storage.get(hash);

		return stream(c, async (stream) => {
			stream.onAbort(() => {
				console.log("Aborted!");
			});

			await stream.pipe(blob.stream());
		});
	},
);

// https://turborepo.com/docs/openapi/artifacts/artifact-exists
router.on(
	"HEAD",
	"/:hash",
	zValidator("param", z.object({ hash: HashSchema })),
	zValidator("query", z.object({ teamId: TeamIdSchema, slug: SlugSchema })),
	async (c) => {
		const user = c.get("user");
		const { hash } = c.req.param();
		const { teamId, slug } = c.req.query();

		invariant(user, "User should be authenticated by now");

		if (!teamId && !slug) {
			return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
		}

		const team = await getTeamForUserWithTeamIdOrSlug(user.id, {
			teamId,
			slug,
		});

		if (!team) {
			return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
		}

		const artifact = await getArtifactForTeam(team.id, hash);

		if (!artifact) {
			return c.json("Not Found", HttpStatusCodes.NOT_FOUND);
		}

		return c.json("OK", HttpStatusCodes.OK);
	},
);

// https://turborepo.com/docs/openapi/artifacts/artifact-query
router.post("/", (c) => {
	// todo: not yet implemented
	return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
});

export default router;
