import type { Database } from "@remote-cache/db";
import type { MiddlewareHandler } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";

import { touchApiKeyForToken } from "../lib/mutations.js";
import { getUserForToken } from "../lib/queries.js";

export type User = {
	id: string;
};

const AUTH_REGEX = new RegExp(`^Bearer +([A-Za-z0-9._~+/-]+=*) *$`);

type Options = {
	database: Database;
};

export function auth({ database }: Options): MiddlewareHandler {
	return async (c, next) => {
		const header = c.req.header("Authorization");

		if (!header) {
			return c.json("Unauthorized", HttpStatusCodes.UNAUTHORIZED);
		}

		const [_, token] = AUTH_REGEX.exec(header) ?? [];

		if (!token) {
			return c.json("Bad Request", HttpStatusCodes.BAD_REQUEST);
		}

		const user = await getUserForToken(database)(token);

		if (!user) {
			return c.json("Unauthorized", HttpStatusCodes.UNAUTHORIZED);
		}

		await touchApiKeyForToken(database)(token);

		c.set("user", user);

		await next();
	};
}

declare module "hono" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface ContextVariableMap {
		user?: User;
	}
}
