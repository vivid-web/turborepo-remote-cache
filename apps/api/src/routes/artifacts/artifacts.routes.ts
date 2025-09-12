import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import {
	ArtifactClientCISchema,
	ArtifactClientInteractiveSchema,
	ArtifactDurationSchema,
	ArtifactInfoSchema,
	ArtifactTagSchema,
	ContentLengthSchema,
	DurationSchema,
	ErrorSchema,
	EventSchema,
	HashSchema,
	SessionIdSchema,
	SlugSchema,
	SourceSchema,
	StatusSchema,
	TeamIdSchema,
} from "../../lib/schemas.js";

export const recordEvents = createRoute({
	path: "/v8/artifacts/events",
	method: "post",
	description:
		"Records an artifacts cache usage event. The body of this request is an array of cache usage events. The supported event types are `HIT` and `MISS`. The source is either `LOCAL` the cache event was on the users filesystem cache or `REMOTE` if the cache event is for a remote cache. When the event is a `HIT` the request also accepts a number `duration` which is the time taken to generate the artifact in the cache.",
	operationId: "recordEvents",
	summary: "Record an artifacts cache usage event",
	tags: ["artifacts"],
	security: [{ Bearer: [] }],
	request: {
		headers: z.object({
			"x-artifact-client-ci": ArtifactClientCISchema,
			"x-artifact-client-interactive": ArtifactClientInteractiveSchema,
		}),
		params: z.object({
			teamId: TeamIdSchema,
			slug: SlugSchema,
		}),
		body: {
			content: {
				"application/json": {
					schema: z
						.object({
							sessionId: SessionIdSchema,
							source: SourceSchema,
							event: EventSchema,
							hash: HashSchema,
							duration: DurationSchema,
						})
						.array(),
				},
			},
		},
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.string(), "Success. Event recorded."),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.string(),
			"One of the provided values in the request body is invalid. One of the provided values in the headers is invalid",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			z.string(),
			"The account was soft-blocked for an unhandled reason. The account is missing a payment so payment method must be updated",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(
			z.string(),
			"You do not have permission to access this resource.",
		),
	},
});

export const status = createRoute({
	path: "/v8/artifacts/status",
	method: "get",
	description:
		"Check the status of Remote Caching for this principal. Returns a JSON-encoded status indicating if Remote Caching is enabled, disabled, or disabled due to usage limits.",
	operationId: "status",
	summary: "Get status of Remote Caching for this principal",
	tags: ["artifacts"],
	security: [{ Bearer: [] }],
	request: {
		params: z.object({
			teamId: TeamIdSchema,
			slug: SlugSchema,
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.object({ status: StatusSchema }), ""),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(z.string(), ""),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.string(), ""),
		[HttpStatusCodes.PAYMENT_REQUIRED]: jsonContent(
			z.string(),
			"The account was soft-blocked for an unhandled reason. The account is missing a payment so payment method must be updated",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(
			z.string(),
			"You do not have permission to access this resource.",
		),
	},
});

export const uploadArtifact = createRoute({
	path: "/v8/artifacts/{hash}",
	method: "put",
	description:
		"Uploads a cache artifact identified by the `hash` specified on the path. The cache artifact can then be downloaded with the provided `hash`.",
	operationId: "uploadArtifact",
	summary: "Upload a cache artifact",
	tags: ["artifacts"],
	security: [{ Bearer: [] }],
	request: {
		params: z.object({ hash: HashSchema }),
		query: z.object({
			teamId: TeamIdSchema,
			slug: SlugSchema,
		}),
		headers: z.object({
			"x-artifact-duration": ArtifactDurationSchema,
			"x-artifact-client-ci": ArtifactClientCISchema,
			"x-artifact-client-interactive": ArtifactClientInteractiveSchema,
			"x-artifact-tag": ArtifactTagSchema,
			"Content-Length": ContentLengthSchema,
		}),
		body: {
			content: {
				"application/octet-stream": {
					schema: z.string().openapi({ format: "binary" }),
				},
			},
		},
	},
	responses: {
		[HttpStatusCodes.ACCEPTED]: jsonContent(
			z.object({
				urls: z.string().array(),
			}),
			"File successfully uploaded",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.string(),
			"One of the provided values in the request query is invalid. One of the provided values in the headers is invalid. File size is not valid",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.string(), ""),
		[HttpStatusCodes.PAYMENT_REQUIRED]: jsonContent(
			z.string(),
			"The account was soft-blocked for an unhandled reason. The account is missing a payment so payment method must be updated",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(
			z.string(),
			"You do not have permission to access this resource.",
		),
	},
});

export const downloadArtifact = createRoute({
	path: "/v8/artifacts/{hash}",
	method: "get",
	description:
		"Downloads a cache artifact identified by its `hash` specified on the request path. The artifact is downloaded as an octet-stream. The client should verify the content-length header and response body.",
	operationId: "downloadArtifact",
	summary: "Download a cache artifact",
	tags: ["artifacts"],
	security: [{ Bearer: [] }],
	request: {
		params: z.object({ hash: HashSchema }),
		query: z.object({
			teamId: TeamIdSchema,
			slug: SlugSchema,
		}),
		headers: z.object({
			"x-artifact-client-ci": ArtifactClientCISchema,
			"x-artifact-client-interactive": ArtifactClientInteractiveSchema,
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: {
			content: {
				"application/octet-stream": {
					schema: z.string().openapi({
						format: "binary",
						description:
							"An octet stream response that will be piped to the response stream.",
					}),
				},
			},
			description:
				"The artifact was found and is downloaded as a stream. Content-Length should be verified.",
			headers: z.object({
				"x-artifact-tag": ArtifactTagSchema,
			}),
		},
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.string(),
			"One of the provided values in the request query is invalid. One of the provided values in the headers is invalid",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.string(), ""),
		[HttpStatusCodes.PAYMENT_REQUIRED]: jsonContent(
			z.string(),
			"The account was soft-blocked for an unhandled reason. The account is missing a payment so payment method must be updated",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(
			z.string(),
			"You do not have permission to access this resource.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			z.string(),
			"The artifact was not found",
		),
	},
});

export const artifactExists = createRoute({
	path: "/v8/artifacts/{hash}",
	method: "head",
	description:
		"Check that a cache artifact with the given `hash` exists. This request returns response headers only and is equivalent to a `GET` request to this endpoint where the response contains no body.",
	operationId: "artifactExists",
	summary: "Check if a cache artifact exists",
	tags: ["artifacts"],
	security: [{ Bearer: [] }],
	request: {
		params: z.object({ hash: HashSchema }),
		query: z.object({
			teamId: TeamIdSchema,
			slug: SlugSchema,
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.string(),
			"The artifact was found and headers are returned",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.string(),
			"One of the provided values in the request query is invalid.",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.string(), ""),
		[HttpStatusCodes.PAYMENT_REQUIRED]: jsonContent(
			z.string(),
			"The account was soft-blocked for an unhandled reason. The account is missing a payment so payment method must be updated",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(
			z.string(),
			"You do not have permission to access this resource.",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			z.string(),
			"The artifact was not found",
		),
	},
});

export const artifactQuery = createRoute({
	path: "/v8/artifacts",
	method: "post",
	description: "Query information about an array of artifacts.",
	operationId: "artifactQuery",
	summary: "Query information about an artifact",
	tags: ["artifacts"],
	security: [{ Bearer: [] }],
	request: {
		params: z.object({
			teamId: TeamIdSchema,
			slug: SlugSchema,
		}),
		body: jsonContentRequired(
			z.object({
				hashes: z.string().array(),
			}),
			"artifact hashes",
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.record(
				z.string(),
				z.union([ArtifactInfoSchema, ErrorSchema]).nullable(),
			),
			"",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.string(),
			"One of the provided values in the request body is invalid.",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(z.string(), ""),
		[HttpStatusCodes.PAYMENT_REQUIRED]: jsonContent(
			z.string(),
			"The account was soft-blocked for an unhandled reason. The account is missing a payment so payment method must be updated",
		),
		[HttpStatusCodes.FORBIDDEN]: jsonContent(
			z.string(),
			"You do not have permission to access this resource.",
		),
	},
});

export type RecordEventsRoute = typeof recordEvents;

export type StatusRoute = typeof status;

export type UploadArtifactRoute = typeof uploadArtifact;

export type DownloadArtifactRoute = typeof downloadArtifact;

export type ArtifactExistsRoute = typeof artifactExists;

export type ArtifactQueryRoute = typeof artifactQuery;
