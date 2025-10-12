import type { Client } from "@remote-cache/db";

import {
	createClient as createLocalClient,
	createDatabase as createLocalDatabase,
	type Client as LocalClient,
} from "@remote-cache/db/providers/local";
import {
	createClient as createNeonClient,
	createDatabase as createNeonDatabase,
	type Client as NeonClient,
} from "@remote-cache/db/providers/neon";

import { env } from "@/env.server";

function isLocalClient(client: Client): client is LocalClient {
	return env.DATABASE_PROVIDER === "local";
}

function isNetlifyNeonClient(client: Client): client is NeonClient {
	return env.DATABASE_PROVIDER === "neon";
}

function createClient() {
	if (env.DATABASE_PROVIDER === "local") {
		return createLocalClient({ connectionString: env.DATABASE_URL });
	}

	return createNeonClient({ connectionString: env.DATABASE_URL });
}

function createDatabase(client: Client) {
	if (isLocalClient(client)) {
		return createLocalDatabase({ client });
	}

	if (isNetlifyNeonClient(client)) {
		return createNeonDatabase({ client });
	}

	throw new Error("Invalid DATABASE_PROVIDER environment variable");
}

export const client = createClient();

export const db = createDatabase(client);
