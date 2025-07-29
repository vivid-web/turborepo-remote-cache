import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle/db";
import { user } from "drizzle/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";

const getTotalUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(user));

function getTotalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: [USERS_QUERY_KEY, "total-users"],
	});
}

function TotalUsersCard() {
	const query = useSuspenseQuery(getTotalUsersQueryOptions());

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-medium">Total Users</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{query.data}</div>
				<p className="text-xs text-muted-foreground">
					Registered in the system
				</p>
			</CardContent>
		</Card>
	);
}

TotalUsersCard.queryOptions = getTotalUsersQueryOptions;

export { TotalUsersCard };
