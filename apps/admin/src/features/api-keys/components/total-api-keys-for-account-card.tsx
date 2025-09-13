import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { invariant } from "@turborepo-remote-cache/core";
import { count, eq } from "@turborepo-remote-cache/db";
import { db } from "@turborepo-remote-cache/db/client";
import { apiKey } from "@turborepo-remote-cache/db/schema";
import { KeyRoundIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authMiddleware } from "@/middlewares/auth";

import { API_KEYS_QUERY_KEY } from "../constants";

const getTotalApiKeysForAccount = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context: { user } }) => {
		const [result] = await db
			.select({ count: count() })
			.from(apiKey)
			.where(eq(apiKey.userId, user.id));

		invariant(result, "Failed to count API keys for account");

		return result.count;
	});

function totalApiKeysForAccountQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalApiKeysForAccount(),
		queryKey: [API_KEYS_QUERY_KEY, "total-api-keys-for-account"],
	});
}

function TotalApiKeysForAccountCard() {
	const query = useSuspenseQuery(totalApiKeysForAccountQueryOptions());

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex items-center gap-2">
					<KeyRoundIcon className="!h-4 !w-4" />
					<CardTitle className="font-medium">Total API keys</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">API keys</p>
			</CardContent>
		</Card>
	);
}

TotalApiKeysForAccountCard.queryOptions = totalApiKeysForAccountQueryOptions;

export { TotalApiKeysForAccountCard };
