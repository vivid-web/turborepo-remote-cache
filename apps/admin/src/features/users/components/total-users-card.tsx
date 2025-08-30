import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@turborepo-remote-cache/db/client";
import { user } from "@turborepo-remote-cache/db/schema";
import { UserIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/middlewares/auth";

import { USERS_QUERY_KEY } from "../constants";

const getTotalUsers = createServerFn({ method: "GET" })
	.middleware([auth])
	.handler(async () => db.$count(user));

function totalUsersQueryOptions() {
	return queryOptions({
		queryFn: async () => getTotalUsers(),
		queryKey: [USERS_QUERY_KEY, "total-users"],
	});
}

function TotalUsersCard() {
	const query = useSuspenseQuery(totalUsersQueryOptions());

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex items-center gap-2">
					<UserIcon className="!h-4 !w-4" />
					<CardTitle className="font-medium">Total Users</CardTitle>
				</div>
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

TotalUsersCard.queryOptions = totalUsersQueryOptions;

export { TotalUsersCard };
