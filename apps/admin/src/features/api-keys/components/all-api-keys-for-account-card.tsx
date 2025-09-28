import { desc, eq } from "@remote-cache/db";
import { db } from "@remote-cache/db/client";
import { apiKey } from "@remote-cache/db/schema";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { API_KEYS_QUERY_KEY } from "../constants";
import { ApiKeysTable } from "./api-keys-table";

const getAllApiKeysForAccount = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async ({ context: { user } }) => {
		return db
			.select({
				apiKeyId: apiKey.id,
				secret: apiKey.secret,
				name: apiKey.name,
				createdAt: apiKey.createdAt,
				lastUsedAt: apiKey.lastUsedAt,
				revokedAt: apiKey.revokedAt,
				expiresAt: apiKey.expiresAt,
			})
			.from(apiKey)
			.where(eq(apiKey.userId, user.id))
			.orderBy(desc(apiKey.lastUsedAt));
	});

function allApiKeysForAccountQueryOptions() {
	return queryOptions({
		queryFn: async () => getAllApiKeysForAccount(),
		queryKey: [API_KEYS_QUERY_KEY, "all-api-keys-for-account"],
	});
}

function AllApiKeysForAccountCard() {
	const query = useSuspenseQuery(allApiKeysForAccountQueryOptions());

	return (
		<Card>
			<CardHeader>
				<CardTitle>All your API keys</CardTitle>
				<CardDescription>
					A list of API keys that belong to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ApiKeysTable apiKeys={query.data} />
			</CardContent>
		</Card>
	);
}

AllApiKeysForAccountCard.queryOptions = allApiKeysForAccountQueryOptions;

export { AllApiKeysForAccountCard };
