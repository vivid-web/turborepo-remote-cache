import { z } from "@hono/zod-openapi";

import {
	DISABLED_STATUS,
	ENABLED_STATUS,
	HIT_EVENT,
	LOCAL_SOURCE,
	MISS_EVENT,
	OVER_LIMIT_STATUS,
	PAUSED_STATUS,
	REMOTE_SOURCE,
} from "./constants.js";

export const TeamIdSchema = z.string().optional().openapi({
	description: "The Team identifier to perform the request on behalf of.",
});

export const SlugSchema = z.string().optional().openapi({
	description: "The Team slug to perform the request on behalf of.",
});

export const SourceSchema = z.literal([LOCAL_SOURCE, REMOTE_SOURCE]).openapi({
	description:
		"One of `LOCAL` or `REMOTE`. `LOCAL` specifies that the cache event was from the user's filesystem cache. `REMOTE` specifies that the cache event is from a remote cache.",
});

export const EventSchema = z.literal([HIT_EVENT, MISS_EVENT]).openapi({
	description:
		"One of `HIT` or `MISS`. `HIT` specifies that a cached artifact for `hash` was found in the cache. `MISS` specifies that a cached artifact with `hash` was not found.",
});

export const SessionIdSchema = z.string().openapi({
	example: "uuid-string",
	description:
		"A UUID (universally unique identifier) for the session that generated this event.",
});

export const DurationSchema = z.number().optional().openapi({
	description:
		"The time taken to generate the artifact. This should be sent as a body parameter on `HIT` events.",
});

export const HashSchema = z
	.string()
	.openapi({ description: "The artifact hash" });

export const StatusSchema = z.literal([
	DISABLED_STATUS,
	ENABLED_STATUS,
	OVER_LIMIT_STATUS,
	PAUSED_STATUS,
]);

export const ErrorSchema = z.object({
	error: z.object({ message: z.string() }),
});

export const ArtifactInfoSchema = z.object({
	size: z.number(),
	taskDurationMs: z.number(),
	tag: z.string().optional(),
});

// Header schemas
export const ArtifactClientCISchema = z.string().max(50).optional().openapi({
	description:
		"The continuous integration or delivery environment where this artifact is downloaded.",
});

export const ArtifactClientInteractiveSchema = z.coerce
	.number()
	.min(0)
	.max(1)
	.optional()
	.openapi({
		description: "1 if the client is an interactive shell. Otherwise 0",
	});

export const ArtifactDurationSchema = z.coerce.number().optional().openapi({
	description:
		"The time taken to generate the uploaded artifact in milliseconds.",
});

export const ArtifactTagSchema = z.string().max(600).optional().openapi({
	description:
		"The base64 encoded tag for this artifact. The value is sent back to clients when the artifact is downloaded as the header `x-artifact-tag`",
});

export const ContentLengthSchema = z.coerce.number().optional().openapi({
	description: "The artifact size in bytes",
});
