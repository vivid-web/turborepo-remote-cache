import { invariant } from "@turborepo-remote-cache/core";
import { stream } from "hono/streaming";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "../../lib/types.js";
import type {
	ArtifactExistsRoute,
	ArtifactQueryRoute,
	DownloadArtifactRoute,
	RecordEventsRoute,
	StatusRoute,
	UploadArtifactRoute,
} from "./artifacts.routes.js";

import { ENABLED_STATUS } from "../../lib/constants.js";
import { env } from "../../lib/env.js";
import { createArtifact } from "../../lib/mutations.js";
import {
	getArtifactForTeam,
	getTeamForUserWithTeamIdOrSlug,
} from "../../lib/queries.js";
import { storage } from "../../lib/storage.js";

export const recordEvents: AppRouteHandler<RecordEventsRoute> = (c) => {
	// todo: not yet implemented
	return c.json("", HttpStatusCodes.OK);
};

export const status: AppRouteHandler<StatusRoute> = (c) => {
	return c.json({ status: ENABLED_STATUS }, HttpStatusCodes.OK);
};

export const uploadArtifact: AppRouteHandler<UploadArtifactRoute> = async (
	c,
) => {
	const user = c.get("user");
	const { hash } = c.req.valid("param");
	const { teamId, slug } = c.req.valid("query");

	invariant(user, "User should be authenticated by now");

	if (!teamId && !slug) {
		return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
	}

	const team = await getTeamForUserWithTeamIdOrSlug(user.id, { teamId, slug });

	if (!team) {
		return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
	}

	const blob = await c.req.blob();

	await storage.set(hash, blob);
	await createArtifact({ hash, teamId: team.id });

	const urls = [`${env.BASE_URL}/v8/artifacts/${hash}`];

	return c.json({ urls }, HttpStatusCodes.ACCEPTED);
};

export const downloadArtifact: AppRouteHandler<DownloadArtifactRoute> = async (
	c,
) => {
	const user = c.get("user");
	const { hash } = c.req.valid("param");
	const { teamId, slug } = c.req.valid("query");

	invariant(user, "User should be authenticated by now");

	if (!teamId && !slug) {
		return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
	}

	const team = await getTeamForUserWithTeamIdOrSlug(user.id, { teamId, slug });

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
};

export const artifactExists: AppRouteHandler<ArtifactExistsRoute> = async (
	c,
) => {
	const user = c.get("user");
	const { hash } = c.req.valid("param");
	const { teamId, slug } = c.req.valid("query");

	invariant(user, "User should be authenticated by now");

	if (!teamId && !slug) {
		return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
	}

	const team = await getTeamForUserWithTeamIdOrSlug(user.id, { teamId, slug });

	if (!team) {
		return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
	}

	const artifact = await getArtifactForTeam(team.id, hash);

	if (!artifact) {
		return c.json("Not Found", HttpStatusCodes.NOT_FOUND);
	}

	return c.json("OK", HttpStatusCodes.OK);
};

export const artifactQuery: AppRouteHandler<ArtifactQueryRoute> = (c) => {
	// todo: not yet implemented
	return c.json("Forbidden", HttpStatusCodes.FORBIDDEN);
};
